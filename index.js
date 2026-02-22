index.js
// Analyze Workflow Inefficiency and ROI Impact

;(async () => {
  try {
    const workflowText = process.env.workflowText

    if (!workflowText) {
      console.log("No workflow input provided.")
      process.exit(1)
    }

    const steps = workflowText
      .split("|")
      .map(step => step.trim())
      .filter(step => step.length > 0)

    const totalSteps = steps.length

    // Keyword definitions
    const approvalKeywords = [/^wait/i, /manual decision/i]
    const storageKeywords = [/store/i, /update/i, /sheet/i, /database/i]
    const notificationKeywords = [/notify/i, /email/i]
    const bottleneckKeywords = [/wait/i]

    let approvalCount = 0
    let storageCount = 0
    let notificationCount = 0
    let bottleneckCount = 0

    const inefficiencyDetails = []

    for (const step of steps) {
      let ineff = []

      if (approvalKeywords.some(rx => rx.test(step))) {
        approvalCount++
        ineff.push("Manual Approval/Wait (5 min)")
      }

      if (storageKeywords.some(rx => rx.test(step))) {
        storageCount++
        ineff.push("Redundant Storage (1 min)")
      }

      if (notificationKeywords.some(rx => rx.test(step))) {
        notificationCount++
        ineff.push("Notification (see below)")
      }

      if (
        bottleneckKeywords.some(rx => rx.test(step)) &&
        !approvalKeywords.some(rx => rx.test(step))
      ) {
        bottleneckCount++
        ineff.push("Sequential Bottleneck (3 min)")
      }

      inefficiencyDetails.push({ step, ineff })
    }

    // Redundancy logic (corrected)
    const redundantStorage = Math.max(storageCount - 1, 0)
    const storageMinutes = redundantStorage * 1

    const manualApprovalMinutes = approvalCount * 5
    const extraNotifications = Math.max(notificationCount - 1, 0)
    const notificationMinutes = extraNotifications * 1
    const bottleneckMinutes = bottleneckCount * 3

    const timeWastePerExecution =
      manualApprovalMinutes +
      storageMinutes +
      notificationMinutes +
      bottleneckMinutes

    const executionsPerMonth = 500
    const monthlyTimeLoss = timeWastePerExecution * executionsPerMonth
    const hourlyCost = 500
    const costPerMinute = hourlyCost / 60
    const monthlyCostLeakage = Math.round(monthlyTimeLoss * costPerMinute)

    const humanDependencyRatio =
      totalSteps > 0 ? approvalCount / totalSteps : 0

    // === Current Maturity ===
    let currentRiskLevel = ""
    let currentMaturityLevel = ""

    if (humanDependencyRatio < 0.1) {
      currentRiskLevel = "Low"
      currentMaturityLevel =
        "Level 3 – Rule-based autonomous workflow"
    } else if (humanDependencyRatio < 0.3) {
      currentRiskLevel = "Moderate"
      currentMaturityLevel =
        "Level 2 – Basic automation with human checkpoints"
    } else {
      currentRiskLevel = "High"
      currentMaturityLevel = "Level 1 – Manual workflow"
    }

    // === Optimized Workflow (manual approvals removed) ===
    const optimizedWorkflow = steps.filter(
      step => !approvalKeywords.some(rx => rx.test(step))
    )

    const optimizedApprovalCount = 0
    const optimizedTotalSteps = optimizedWorkflow.length

    const optimizedHumanDependencyRatio =
      optimizedTotalSteps > 0
        ? optimizedApprovalCount / optimizedTotalSteps
        : 0

    let optimizedRiskLevel = ""
    let optimizedMaturityLevel = ""

    if (optimizedHumanDependencyRatio < 0.1) {
      optimizedRiskLevel = "Low"
      optimizedMaturityLevel =
        "Level 3 – Rule-based autonomous workflow"
    } else if (optimizedHumanDependencyRatio < 0.3) {
      optimizedRiskLevel = "Moderate"
      optimizedMaturityLevel =
        "Level 2 – Basic automation with human checkpoints"
    } else {
      optimizedRiskLevel = "High"
      optimizedMaturityLevel = "Level 1 – Manual workflow"
    }

    const optimizedWastePerExecution = 2
    const optimizedMonthlyMinutes = optimizedWastePerExecution * executionsPerMonth
    const optimizedMonthlyHours = optimizedMonthlyMinutes / 60
    const optimizedMonthlyCost = Math.round(
      optimizedMonthlyHours * hourlyCost
    )

    const savings = Math.round(
      monthlyCostLeakage - optimizedMonthlyCost
    )

    const efficiencyImprovement = (
      (savings / monthlyCostLeakage) *
      100
    ).toFixed(2)

    // ===== OUTPUT =====

    console.log("--- Workflow Inefficiency and ROI Impact Report ---")
    console.log(`Workflow Steps: ${totalSteps}`)

    console.log("\nStep Details:")
    inefficiencyDetails.forEach((item, idx) => {
      console.log(`  ${idx + 1}. ${item.step}`)
      if (item.ineff.length) {
        console.log(`     Inefficiencies: ${item.ineff.join(", ")}`)
      }
    })

    console.log("\nDetected Inefficiencies:")
    console.log(`  Manual Approval Steps: ${approvalCount} (5 min each)`)
    console.log(`  Redundant Storage Actions: ${redundantStorage} (1 min each)`)
    console.log(`  Notification Steps: ${notificationCount} (1 min for each extra beyond first)`)
    console.log(`  Sequential Bottleneck Steps: ${bottleneckCount} (3 min each)`)

    console.log("\nSummary:")
    console.log(`  Time Waste Per Execution: ${timeWastePerExecution} min`)
    console.log(`  Monthly Time Loss: ${monthlyTimeLoss} min`)
    console.log(`  Estimated Monthly Cost Leakage: ₹${monthlyCostLeakage}`)
    console.log(`  Human Dependency Ratio: ${(humanDependencyRatio * 100).toFixed(2)}%`)
    console.log(`  Operational Risk Level: ${currentRiskLevel}`)
    console.log(`  Automation Maturity Level: ${currentMaturityLevel}`)

    console.log("\n--- Optimization Simulation ---")
    console.log(`  Optimized Time Waste Per Execution: ${optimizedWastePerExecution} min`)
    console.log(`  Optimized Monthly Cost: ₹${optimizedMonthlyCost}`)
    console.log(`  Projected Monthly Savings: ₹${savings}`)
    console.log(`  Efficiency Improvement: ${efficiencyImprovement}%`)

    console.log("\n--- Maturity Comparison ---")
    console.log(`  Current Maturity Level: ${currentMaturityLevel}`)
    console.log(`  Post-Optimization Maturity Level: ${optimizedMaturityLevel}`)

    console.log("\n--- AMTG / Final Workflow Summary ---")
    console.table({
      "Total Steps": totalSteps,
      "Manual Approval Steps": approvalCount,
      "Redundant Storage Actions": redundantStorage,
      "Extra Notifications": extraNotifications,
      "Bottlenecks": bottleneckCount,
      "Time Waste/Execution (min)": timeWastePerExecution,
      "Monthly Cost Leakage (₹)": monthlyCostLeakage,
      "Human Dependency (%)": (humanDependencyRatio * 100).toFixed(2),
      "Current Maturity": currentMaturityLevel,
      "Optimized Maturity": optimizedMaturityLevel,
      "Optimized Monthly Cost (₹)": optimizedMonthlyCost,
      "Projected Savings (₹)": savings
    })

    console.log("\nOptimized Workflow Structure:")
    optimizedWorkflow.forEach((s, i) =>
      console.log(`  ${i + 1}. ${s}`)
    )

    process.exit(0)
  } catch (e) {
    console.error("Error in workflow analysis:", e)
    process.exit(1)
  }
})()
