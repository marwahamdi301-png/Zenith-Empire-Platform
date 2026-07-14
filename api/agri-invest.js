import redis from "../lib/redis.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  
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
      investmentId,
      projectId,
      investorId,
      amount: investAmount,
      sharePercent: (investAmount / projectData.targetAmount) * 100,
      investedAt: new Date().toISOString(),
      status: "pending"
    };
    
    await redis.set(`agrinvestment:${investmentId}`, investmentData);
    
    projectData.currentRaised = newRaised;
    projectData.investors.push(investmentId);
    
    if (newRaised >= projectData.targetAmount) {
      projectData.status = "funded";
    }
    
    await redis.set(`agriproject:${projectId}`, projectData);
    
    return res.status(201).json({ 
      success: true, 
      investmentId,
      projectFunded: projectData.status === "funded"
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
