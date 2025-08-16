import { SimulationBuilder } from "stxer";
import { ClarityVersion } from "@stacks/transactions";
import * as fs from "fs";

async function simulateFix52() {
  // You can use any address as the deployer/sender
  const DEPLOYER = "SP3AJC728JY0Y43E8RT6K4VDWPT265RDMXJ8M0VH0"; // Using one of the participants from your list

  try {
    const simulation = SimulationBuilder.new({
      network: "mainnet", // or 'testnet' if you prefer
    })
      .withSender(DEPLOYER)
      .addContractDeploy({
        contract_name: "fix-52",
        source_code: fs.readFileSync("./contracts/fix-52.clar", "utf8"),
        clarity_version: ClarityVersion.Clarity3, // Using Clarity3 as recommended
      });

    const simulationId = await simulation.run();
    console.log(`Simulation created successfully!`);
    console.log(
      `View results at: https://stxer.xyz/simulations/mainnet/${simulationId}`
    );

    return simulationId;
  } catch (error) {
    console.error("Simulation failed:", error);
    throw error;
  }
}

// Run the simulation
simulateFix52().catch(console.error);
