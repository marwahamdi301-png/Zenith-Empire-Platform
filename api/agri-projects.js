import redis from "../lib/redis.js";

export default async function handler(req, res) {
  if (req.method === "GET") {
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
  
  if (req.method === "POST") {
    const { farmerId, title, amount, targetAmount, harvestDate, description } = req.body;
    
    if (!farmerId || !title || !amount || !targetAmount) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    try {
      const projectId = "agri_" + Date.now();
      const projectData = {
        projectId,
        farmerId,
        title,
        description,
        initialAmount: parseFloat(amount),
        targetAmount: parseFloat(targetAmount),
        currentRaised: 0,
        status: "active",
        harvestDate,
        createdAt: new Date().toISOString(),
        investors: []
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
  
  return res.status(405).json({ error: "Method not allowed" });
}
