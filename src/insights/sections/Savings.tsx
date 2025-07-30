import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import TreeAnimation from "../components/TreeAnimation";
import { ensureValidSession } from "../../services/session";
import { supabase } from "../../onboarding/services/supabaseClient";

interface TreeGrowthSectionProps {
  initialPercentage?: number;
  autoGrow?: boolean;
  showControls?: boolean;
}

const TreeGrowthSection: React.FC<TreeGrowthSectionProps> = ({
  initialPercentage = 0,
  autoGrow = false,
  showControls = true,
}) => {
  const [currentPercentage, setCurrentPercentage] = useState(initialPercentage);
  const [isAutoMode, setIsAutoMode] = useState(autoGrow);
  const [loading, setLoading] = useState(true);
  const [percentage, setPercentage] = useState<number | null>(null);

  useEffect(() => {
    const fetchPercentage = async () => {
      setLoading(true);
      const session = await ensureValidSession();
      if (!session?.user?.id) {
        setPercentage(null);
        setLoading(false);
        return;
      }

      const { data: goalData, error: goalError } = await supabase
        .from("savings_info")
        .select("goal_amount")
        .limit(1)
        .single();

      const { data: accountData, error: accountError } = await supabase
        .from("accounts")
        .select("balance")
        .eq("account_name", "savings")
        .limit(1)
        .single();

      if (goalError || accountError || !goalData || !accountData) {
        console.error("Error fetching data", goalError, accountError);
        setPercentage(null);
      } else {
        const { goal_amount } = goalData;
        const { balance } = accountData;

        const calc =
          goal_amount === 0
            ? 100
            : Math.round((balance * 10000) / goal_amount) / 100;

        setPercentage(calc);
        setCurrentPercentage(calc);
      }

      setLoading(false);
    };

    fetchPercentage();
  }, []);

  useEffect(() => {
    if (!isAutoMode) return;

    const interval = setInterval(() => {
      setCurrentPercentage((prev) => {
        if (prev >= 100) {
          return 0;
        }
        return prev + 3;
      });
    }, 300);

    return () => clearInterval(interval);
  }, [isAutoMode]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Savings</Text>

      {loading || percentage === null ? (
        <Text>Loading...</Text>
      ) : (
        <View style={styles.card}>
          <View style={styles.progressInfo}>
            <View style={styles.percentageContainer}>
              <Text style={styles.percentageText}>
                {Math.round(percentage)}%
              </Text>
            </View>
          </View>

          <View style={styles.treeWrapper}>
            <View style={styles.treeContainer}>
              <TreeAnimation percentage={currentPercentage} width={280} height={320} />
            </View>
          </View>
        </View>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginBottom: 8,
    paddingHorizontal: 24,
  },
  title: {
    color: "#1c1c1c",
    fontSize: 26,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  progressInfo: {
    marginBottom: 16,
  },
  percentageContainer: {
    alignItems: "center",
    marginBottom: 12,
  },
  percentageText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#2F4F2F",
    fontFamily: "Inter_600SemiBold",
  },
  stageText: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
  },
  progressBarContainer: {
    alignItems: "center",
  },
  progressBarBackground: {
    width: "100%",
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    overflow: "hidden",
  },
  treeWrapper: {
    alignItems: "center",
    marginVertical: 16,
  },
  treeContainer: {
    backgroundColor: "#f8fffe",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E8F5E8",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  controlsContainer: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  sliderContainer: {
    marginBottom: 16,
  },
  controlLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    fontWeight: "500",
  },
  slider: {
    width: "100%",
    height: 40,
  },
  sliderThumb: {
    backgroundColor: "#32CD32",
    width: 20,
    height: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  controlButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
  },
  decreaseButton: {
    backgroundColor: "#ff6b6b",
  },
  increaseButton: {
    backgroundColor: "#4ecdc4",
  },
  playButton: {
    backgroundColor: "#32CD32",
  },
  pauseButton: {
    backgroundColor: "#ffa726",
  },
  resetButton: {
    backgroundColor: "#666",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 12,
    textAlign: "center",
  },
});

export default TreeGrowthSection;
