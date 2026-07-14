import redis from "../lib/redis.js";

export default async function handler(req, res) {
  const { action } = req.query;

  // === GET: عرض المشاريع ===
  if (req.method === "GET" && action === "list") {
    try {
      const list = await redis.get("agriprojects:list");
      const projectIds = list ? list : [];
      const projects = [];
      for (const id of projectIds) {
        const proj = await redis.get(`agriproject:${id}`);
        if (proj) projects.push(proj);
      }
      return res.status(200).json(projects);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // === POST: إنشاء مشروع ===
  if (req.method === "POST" && action === "create") {
    const { farmerId, title, amount, targetAmount, harvestDate, description } = req.body;
    if (!farmerId || !title || !amount || !targetAmount) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    try {
      const projectId = "agri_" + Date.now();
      const projectData = {
        projectId, farmerId, title, description,
        initialAmount: parseFloat(amount),
        targetAmount: parseFloat(targetAmount),
        currentRaised: 0, status: "active", harvestDate,
        createdAt: new Date().toISOString(), investors: []
      };
      await redis.set(`agriproject:${projectId}`, projectData);
      const list = await redis.get("agriprojects:list");
      const projectIds = list ? list : [];
      projectIds.push(projectId);
      await redis.set("agriprojects:list", projectIds);
      return res.status(201).json({ success: true, projectId });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // === POST: استثمار ===
  if (req.method === "POST" && action === "invest") {
    const { projectId, investorId, amount } = req.body;
    if (!projectId || !investorId || !amount) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    try {
      const projectData = await redis.get(`agriproject:${projectId}`);
      if (!projectData) return res.status(404).json({ error: "Project not found" });
      if (projectData.status !== "active") {
        return res.status(400).json({ error: "Project not active" });
      }
      const investAmount = parseFloat(amount);
      const newRaised = projectData.currentRaised + investAmount;
      if (newRaised > projectData.targetAmount) {
        return res.status(400).json({ error: "Investment exceeds target" });
      }
      const investmentId = `inv_${projectId}_${investorId}_${Date.now()}`;
      const investmentData = {
        investmentId, projectId, investorId, amount: investAmount,
        sharePercent: (investAmount / projectData.targetAmount) * 100,
        investedAt: new Date().toISOString(), status: "pending"
      };
      await redis.set(`agrinvestment:${investmentId}`, investmentData);
      projectData.currentRaised = newRaised;
      projectData.investors.push(investmentId);
      if (newRaised >= projectData.targetAmount) projectData.status = "funded";
      await redis.set(`agriproject:${projectId}`, projectData);
      return res.status(201).json({ success: true, investmentId, projectFunded: projectData.status === "funded" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // === POST: توزيع أرباح ===
  if (req.method === "POST" && action === "distribute") {
    const { projectId, totalProfit, adminKey } = req.body;
    if (adminKey !== process.env.ADMIN_TOKEN) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const projectData = await redis.get(`agriproject:${projectId}`);
      if (!projectData) return res.status(404).json({ error: "Project not found" });
      const profit = parseFloat(totalProfit);
      const distribution = {
        distributionId: `dist_${projectId}_${Date.now()}`,
        projectId, totalProfit: profit,
        distributedAt: new Date().toISOString(), investments: []
      };
      for (const investmentId of projectData.investors) {
        const investData = await redis.get(`agrinvestment:${investmentId}`);
        if (!investData) continue;
        const profitShare = (investData.sharePercent / 100) * profit;
        distribution.investments.push({ investmentId, investorId: investData.investorId, profitShare });
      }
      await redis.set(`agridistribution:${projectId}`, distribution);
      projectData.status = "completed";
      await redis.set(`agriproject:${projectId}`, projectData);
      return res.status(200).json({ success: true, distribution });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(400).json({ error: "Invalid action or method" });
}
