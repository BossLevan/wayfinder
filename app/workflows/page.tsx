"use client";

import { useState, useEffect } from "react";
import { SettingsLayout } from "../settings/_components/settings-layout";
import { Card, Button } from "../settings/_components/ui";
import { Plus, Pause, Play, Settings, Trash2, Zap } from "lucide-react";
import { ActivateWorkflowModal } from "../_components/activate-workflow-modal";
import { DeactivateWorkflowModal } from "../_components/deactivate-workflow-modal";

type Category =
  | "All"
  | "Growth"
  | "Engagement"
  | "Momentum"
  | "Index"
  | "Retention"
  | "Loyalty";

type WorkflowParameter = {
  key: string;
  label: string;
  type: "number" | "text" | "select";
  defaultValue: string | number;
  suffix?: string;
  options?: { value: string; label: string }[];
  hint?: string;
};

type Workflow = {
  id: string;
  title: string;
  description: string;
  steps: string[];
  category: Category;
  parameters?: WorkflowParameter[];
};

type ActiveWorkflow = Workflow & {
  activatedAt: Date;
  status: "active" | "paused";
  executionCount: number;
  nextExecution: Date;
  config: Record<string, string | number>;
};

const workflows: Workflow[] = [
  {
    id: "weekly-buyback-airdrop",
    title: "Weekly Buyback + Monthly Airdrop",
    description: "Run buybacks every week, then airdrop to top holders monthly",
    steps: ["Buyback weekly", "Airdrop to top holders monthly"],
    category: "Growth",
    parameters: [
      {
        key: "buybackPercentage",
        label: "Buyback Percentage",
        type: "number",
        defaultValue: 3,
        suffix: "%",
        hint: "Percentage of treasury to use for buyback",
      },
      {
        key: "airdropAmount",
        label: "Airdrop Amount",
        type: "number",
        defaultValue: 1000,
        suffix: "tokens",
        hint: "Number of tokens to airdrop",
      },
      {
        key: "topHolders",
        label: "Top Holders",
        type: "number",
        defaultValue: 10,
        hint: "Number of top holders to receive airdrop",
      },
    ],
  },
  {
    id: "new-holder-welcome",
    title: "New Holder Welcome",
    description: "Airdrop to new holders 24h after their first purchase",
    steps: ["Detect new holder", "Wait configured time", "Airdrop tokens"],
    category: "Engagement",
    parameters: [
      {
        key: "waitTime",
        label: "Wait Time",
        type: "number",
        defaultValue: 24,
        suffix: "hours",
        hint: "Time to wait before airdrop",
      },
      {
        key: "airdropAmount",
        label: "Airdrop Amount",
        type: "number",
        defaultValue: 100,
        suffix: "tokens",
        hint: "Number of tokens to airdrop",
      },
    ],
  },
  {
    id: "volume-triggered-buyback",
    title: "Volume-Triggered Buyback",
    description: "Automatically buyback when 24h volume exceeds threshold",
    steps: [
      "Monitor 24h volume",
      "If threshold exceeded, buyback",
      "Share to X",
    ],
    category: "Momentum",
    parameters: [
      {
        key: "volumeThreshold",
        label: "Volume Threshold",
        type: "number",
        defaultValue: 50000,
        suffix: "USD",
        hint: "Minimum 24h volume to trigger buyback",
      },
      {
        key: "buybackPercentage",
        label: "Buyback Percentage",
        type: "number",
        defaultValue: 2,
        suffix: "%",
        hint: "Percentage to buyback when triggered",
      },
    ],
  },
  {
    id: "index-rebalance",
    title: "Index Rebalance Weekly",
    description: "Rebalance index basket every 7 days based on momentum",
    steps: ["Calculate momentum", "Rebalance top coins", "Execute buys"],
    category: "Index",
    parameters: [
      {
        key: "topCoins",
        label: "Top Coins Count",
        type: "number",
        defaultValue: 5,
        hint: "Number of top coins to include",
      },
      {
        key: "momentumPeriod",
        label: "Momentum Period",
        type: "number",
        defaultValue: 7,
        suffix: "days",
        hint: "Period for momentum calculation",
      },
    ],
  },
  {
    id: "dormant-holder-reactivation",
    title: "Dormant Holder Reactivation",
    description: "Airdrop to holders with no activity in 90+ days",
    steps: ["Identify dormant holders", "Airdrop tokens", "Send notification"],
    category: "Retention",
    parameters: [
      {
        key: "dormantDays",
        label: "Dormant Period",
        type: "number",
        defaultValue: 90,
        suffix: "days",
        hint: "Days of inactivity to be considered dormant",
      },
      {
        key: "airdropAmount",
        label: "Airdrop Amount",
        type: "number",
        defaultValue: 500,
        suffix: "tokens",
        hint: "Tokens to airdrop to dormant holders",
      },
    ],
  },
  {
    id: "whale-revenue-sharing",
    title: "Whale Revenue Sharing",
    description: "Share revenue with top holders weekly",
    steps: [
      "Calculate weekly revenue",
      "Distribute to top holders",
      "Log transaction",
    ],
    category: "Loyalty",
    parameters: [
      {
        key: "revenuePercentage",
        label: "Revenue Share",
        type: "number",
        defaultValue: 5,
        suffix: "%",
        hint: "Percentage of revenue to share",
      },
      {
        key: "topHolders",
        label: "Top Holders",
        type: "number",
        defaultValue: 3,
        hint: "Number of top holders to share with",
      },
    ],
  },
];

const categories: Category[] = [
  "All",
  "Growth",
  "Engagement",
  "Momentum",
  "Index",
  "Retention",
  "Loyalty",
];

export default function WorkflowsPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [activeWorkflows, setActiveWorkflows] = useState<ActiveWorkflow[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(
    null
  );
  const [workflowToRemove, setWorkflowToRemove] =
    useState<ActiveWorkflow | null>(null);
  const [workflowConfig, setWorkflowConfig] = useState<
    Record<string, string | number>
  >({});

  // Load active workflows from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("activeWorkflows");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        const workflows = parsed.map((w: ActiveWorkflow) => ({
          ...w,
          activatedAt: new Date(w.activatedAt),
          nextExecution: new Date(w.nextExecution),
        }));
        setActiveWorkflows(workflows);
      } catch (error) {
        console.error("Failed to load active workflows:", error);
      }
    }
  }, []);

  // Save active workflows to localStorage whenever they change
  useEffect(() => {
    if (activeWorkflows.length > 0) {
      localStorage.setItem("activeWorkflows", JSON.stringify(activeWorkflows));
    } else {
      localStorage.removeItem("activeWorkflows");
    }
  }, [activeWorkflows]);

  const filteredWorkflows =
    activeCategory === "All"
      ? workflows.filter((w) => !activeWorkflows.some((aw) => aw.id === w.id))
      : workflows.filter(
          (w) =>
            w.category === activeCategory &&
            !activeWorkflows.some((aw) => aw.id === w.id)
        );

  const handleActivateClick = (workflow: Workflow) => {
    setSelectedWorkflow(workflow);
    // Initialize config with default values
    const defaultConfig: Record<string, string | number> = {};
    workflow.parameters?.forEach((param) => {
      defaultConfig[param.key] = param.defaultValue;
    });
    setWorkflowConfig(defaultConfig);
    setIsModalOpen(true);
  };

  const handleActivateComplete = (config: Record<string, string | number>) => {
    if (selectedWorkflow) {
      // Calculate next execution based on workflow type
      const now = new Date();
      const nextExecution = new Date(now);

      // Different schedules for different workflow types
      if (selectedWorkflow.title.includes("Weekly")) {
        nextExecution.setDate(nextExecution.getDate() + 7);
      } else if (selectedWorkflow.title.includes("Monthly")) {
        nextExecution.setMonth(nextExecution.getMonth() + 1);
      } else if (
        selectedWorkflow.title.includes("24h") ||
        selectedWorkflow.title.includes("New Holder")
      ) {
        nextExecution.setHours(nextExecution.getHours() + 24);
      } else {
        // Default: next hour
        nextExecution.setHours(nextExecution.getHours() + 1);
      }

      const newActiveWorkflow: ActiveWorkflow = {
        ...selectedWorkflow,
        activatedAt: new Date(),
        status: "active",
        executionCount: 0,
        nextExecution,
        config,
      };
      setActiveWorkflows([newActiveWorkflow, ...activeWorkflows]);
    }
  };

  const handleTogglePause = (workflowId: string) => {
    setActiveWorkflows(
      activeWorkflows.map((w) =>
        w.id === workflowId
          ? { ...w, status: w.status === "active" ? "paused" : "active" }
          : w
      )
    );
  };

  const handleRemoveClick = (workflow: ActiveWorkflow) => {
    setWorkflowToRemove(workflow);
    setIsDeactivateModalOpen(true);
  };

  const handleRemoveComplete = () => {
    if (workflowToRemove) {
      setActiveWorkflows(
        activeWorkflows.filter((w) => w.id !== workflowToRemove.id)
      );
      setWorkflowToRemove(null);
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const formatNextExecution = (date: Date) => {
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Starting now";
    if (diffMins < 60) return `in ${diffMins}m`;
    if (diffHours < 24) return `in ${diffHours}h`;
    if (diffDays < 7) return `in ${diffDays}d`;
    return `in ${Math.floor(diffDays / 7)}w`;
  };

  return (
    <SettingsLayout
      header={undefined}
      sidebarActive="Workflows"
      tabs={[]}
      activeTab=""
      onTabChange={() => {}}
      aboveContent={
        <div className="flex flex-col gap-2">
          <div className="text-3xl font-semibold text-white/90">
            Workflow Templates
          </div>
        </div>
      }
    >
      <ActivateWorkflowModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onComplete={handleActivateComplete}
        workflow={selectedWorkflow}
        initialConfig={workflowConfig}
      />

      <DeactivateWorkflowModal
        isOpen={isDeactivateModalOpen}
        onClose={() => setIsDeactivateModalOpen(false)}
        onComplete={handleRemoveComplete}
        workflow={workflowToRemove}
      />

      <div className="space-y-6">
        {/* Active Workflows Section */}
        {activeWorkflows.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white/90">
                Active Workflows
              </h2>
              <span className="text-sm text-white/60">
                {activeWorkflows.filter((w) => w.status === "active").length}{" "}
                running
              </span>
            </div>

            <div className="space-y-3">
              {activeWorkflows.map((workflow) => (
                <Card
                  key={workflow.id}
                  className="p-5 hover:border-white/20 transition"
                >
                  <div className="flex items-start gap-4">
                    {/* Status Indicator */}
                    <div className="shrink-0 mt-1">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          workflow.status === "active"
                            ? "bg-green-500/20"
                            : "bg-white/10"
                        }`}
                      >
                        <Zap
                          size={20}
                          className={
                            workflow.status === "active"
                              ? "text-green-400"
                              : "text-white/40"
                          }
                        />
                      </div>
                    </div>

                    {/* Workflow Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <h3 className="text-base font-semibold text-white/90 mb-1">
                            {workflow.title}
                          </h3>
                          <p className="text-sm text-white/60">
                            {workflow.description}
                          </p>
                        </div>
                        <div
                          className={`px-2 py-1 rounded text-xs whitespace-nowrap ${
                            workflow.status === "active"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-white/10 text-white/60"
                          }`}
                        >
                          {workflow.status === "active" ? "Active" : "Paused"}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-white/60 mb-3">
                        <span>
                          Activated {formatDate(workflow.activatedAt)}
                        </span>
                        <span>•</span>
                        <span>{workflow.executionCount} executions</span>
                        <span>•</span>
                        <span className="px-2 py-0.5 bg-white/10 rounded">
                          {workflow.category}
                        </span>
                      </div>

                      {/* Next Execution */}
                      {workflow.status === "active" && (
                        <div className="flex items-center gap-2 text-xs mb-3">
                          <div className="px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded text-blue-400">
                            Next execution:{" "}
                            {formatNextExecution(workflow.nextExecution)}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleTogglePause(workflow.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white/80 hover:bg-white/10 hover:border-white/20 transition"
                        >
                          {workflow.status === "active" ? (
                            <>
                              <Pause size={12} />
                              <span>Pause</span>
                            </>
                          ) : (
                            <>
                              <Play size={12} />
                              <span>Resume</span>
                            </>
                          )}
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white/80 hover:bg-white/10 hover:border-white/20 transition">
                          <Settings size={12} />
                          <span>Configure</span>
                        </button>
                        <button
                          onClick={() => handleRemoveClick(workflow)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-red-400/80 hover:bg-red-500/10 hover:border-red-500/20 transition"
                        >
                          <Trash2 size={12} />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Templates Section */}
        <div className="flex items-center gap-2 flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition border ${
                activeCategory === category
                  ? "bg-white text-black border-white/20"
                  : "bg-white/5 text-white/80 hover:bg-white/10 border-white/10 hover:border-white/20"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Workflow Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredWorkflows.map((workflow) => (
            <Card
              key={workflow.id}
              className="p-6 hover:border-white/20 transition"
            >
              <div className="flex flex-col gap-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-white/90 mb-1">
                      {workflow.title}
                    </h3>
                    <p className="text-sm text-white/60">
                      {workflow.description}
                    </p>
                  </div>
                  <div className="px-2 py-1 bg-white/10 rounded text-xs text-white/70 whitespace-nowrap">
                    {workflow.category}
                  </div>
                </div>

                {/* Steps */}
                <div className="space-y-2">
                  {workflow.steps.map((step, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 text-sm text-white/70"
                    >
                      <span className="text-white/50">{index + 1}.</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleActivateClick(workflow)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white/80 hover:bg-white/10 hover:border-white/20 transition"
                >
                  <Plus size={14} />
                  <span>Activate Workflow</span>
                </button>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredWorkflows.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/60">
              No workflows found in this category.
            </p>
          </div>
        )}
      </div>
    </SettingsLayout>
  );
}
