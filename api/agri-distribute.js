import redis from "../lib/redis.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  
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
      projectId,
      totalProfit: profit,
      distributedAt: new Date().toISOString(),
      investments: []
    };
    
    for (const investmentId of projectData.investors) {
      const investData = await redis.get(`agrinvestment:${investmentId}`);
      if (!investData) continue;
      
      const profitShare = (investData.sharePercent / 100) * profit;
      
      distribution.investments.push({
        investmentId,
        investorId: investData.investorId,
        profitShare
      });
    }
    
    await redis.set(`agridistribution:${projectId}`, distribution);
    
    projectData.status = "completed";
    await redis.set(`agriproject:${projectId}`, projectData);
    
    return res.status(200).json({ success: true, distribution });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
