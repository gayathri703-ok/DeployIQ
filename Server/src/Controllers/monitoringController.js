// server/src/controllers/monitoringController.js

import si from "systeminformation";
import Docker from "dockerode";

const docker = new Docker({
  socketPath: process.env.DOCKER_HOST || "/var/run/docker.sock",
});

// ======================================
// GET SYSTEM STATS
// CPU + Memory + Disk
// ======================================

export const getSystemStats = async (req, res) => {
  try {
    // Run all checks in parallel for speed
    const [cpu, mem, disk, osInfo, uptime] = await Promise.all([
      si.currentLoad(),
      si.mem(),
      si.fsSize(),
      si.osInfo(),
      si.time(),
    ]);

    // CPU
    const cpuUsage = parseFloat(cpu.currentLoad.toFixed(1));

    // Memory
    const totalMemMB  = (mem.total  / 1024 / 1024).toFixed(0);
    const usedMemMB   = (mem.active / 1024 / 1024).toFixed(0);
    const memPercent  = parseFloat(((mem.active / mem.total) * 100).toFixed(1));

    // Disk — use the largest/main disk
    const mainDisk    = disk.sort((a, b) => b.size - a.size)[0] || {};
    const totalDiskGB = ((mainDisk.size || 0) / 1024 / 1024 / 1024).toFixed(1);
    const usedDiskGB  = ((mainDisk.used || 0) / 1024 / 1024 / 1024).toFixed(1);
    const diskPercent = parseFloat(mainDisk.use || 0).toFixed(1);

    return res.status(200).json({
      success: true,
      cpu: {
        usage: cpuUsage,
      },
      memory: {
        total:   Number(totalMemMB),
        used:    Number(usedMemMB),
        percent: memPercent,
      },
      disk: {
        total:   Number(totalDiskGB),
        used:    Number(usedDiskGB),
        percent: Number(diskPercent),
      },
      system: {
        platform: osInfo.platform,
        distro:   osInfo.distro,
        uptime:   uptime.uptime,
      },
    });
  } catch (error) {
    console.error("SYSTEM STATS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// GET CONTAINER STATUS
// ======================================

export const getContainerStatus = async (req, res) => {
  try {
    let containers = [];

    try {
      const list = await docker.listContainers({ all: true });

      containers = await Promise.all(
        list.map(async (c) => {
          let cpuPercent = 0;
          let memMB      = 0;
          let memPercent = 0;

          // Try to get live stats
          try {
            const container = docker.getContainer(c.Id);
            const stats = await container.stats({ stream: false });

            // CPU %
            const cpuDelta    = stats.cpu_stats.cpu_usage.total_usage - stats.precpu_stats.cpu_usage.total_usage;
            const systemDelta = stats.cpu_stats.system_cpu_usage       - stats.precpu_stats.system_cpu_usage;
            const numCpus     = stats.cpu_stats.online_cpus || 1;
            cpuPercent = parseFloat(((cpuDelta / systemDelta) * numCpus * 100).toFixed(1));

            // Memory
            memMB      = parseFloat((stats.memory_stats.usage / 1024 / 1024).toFixed(1));
            memPercent = parseFloat(((stats.memory_stats.usage / stats.memory_stats.limit) * 100).toFixed(1));
          } catch {
            // container might be stopped — stats unavailable
          }

          return {
            id:        c.Id.slice(0, 12),
            name:      c.Names?.[0]?.replace("/", "") || "unknown",
            image:     c.Image,
            status:    c.Status,
            state:     c.State,           // "running" | "exited" | "paused"
            ports:     c.Ports,
            created:   c.Created,
            cpu:       cpuPercent,
            memoryMB:  memMB,
            memPercent,
          };
        })
      );
    } catch {
      // Docker not available — return empty list
      containers = [];
    }

    return res.status(200).json({
      success: true,
      total:   containers.length,
      running: containers.filter((c) => c.state === "running").length,
      stopped: containers.filter((c) => c.state === "exited").length,
      containers,
    });
  } catch (error) {
    console.error("CONTAINER STATUS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// GET FULL MONITORING SUMMARY
// (single endpoint — frontend calls this)
// ======================================

export const getMonitoringSummary = async (req, res) => {
  try {
    const [cpu, mem, disk, osInfo, uptime] = await Promise.all([
      si.currentLoad(),
      si.mem(),
      si.fsSize(),
      si.osInfo(),
      si.time(),
    ]);

    let containerData = { total: 0, running: 0, stopped: 0, containers: [] };

    try {
      const list = await docker.listContainers({ all: true });
      containerData.total   = list.length;
      containerData.running = list.filter((c) => c.State === "running").length;
      containerData.stopped = list.filter((c) => c.State === "exited").length;
      containerData.containers = list.map((c) => ({
        id:     c.Id.slice(0, 12),
        name:   c.Names?.[0]?.replace("/", "") || "unknown",
        image:  c.Image,
        status: c.Status,
        state:  c.State,
      }));
    } catch {
      // Docker unavailable
    }

    const mainDisk = disk.sort((a, b) => b.size - a.size)[0] || {};

    return res.status(200).json({
      success: true,
      cpu: {
        usage: parseFloat(cpu.currentLoad.toFixed(1)),
      },
      memory: {
        total:   parseFloat((mem.total  / 1024 / 1024 / 1024).toFixed(2)),  // GB
        used:    parseFloat((mem.active / 1024 / 1024 / 1024).toFixed(2)),  // GB
        percent: parseFloat(((mem.active / mem.total) * 100).toFixed(1)),
      },
      disk: {
        total:   parseFloat(((mainDisk.size || 0) / 1024 / 1024 / 1024).toFixed(1)),
        used:    parseFloat(((mainDisk.used || 0) / 1024 / 1024 / 1024).toFixed(1)),
        percent: parseFloat(mainDisk.use || 0),
      },
      system: {
        platform: osInfo.platform,
        distro:   osInfo.distro,
        arch:     osInfo.arch,
        uptime:   Math.floor(uptime.uptime),  // seconds
      },
      containers: containerData,
    });
  } catch (error) {
    console.error("MONITORING SUMMARY ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};