import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import TreeGrowth from "../components/TreeAnimation";
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
        .eq("uid", session.user.id) // ✅ filtrado por usuario
        .limit(1)
        .single();

      const { data: accountData, error: accountError } = await supabase
        .from("accounts")
        .select("balance")
        .eq("account_name", "savings")
        .eq("uid", session.user.id) // ✅ filtrado por usuario
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
    // Resetear la animación cuando cambia el percentage
    setCurrentPercentage(0);

    const interval = setInterval(() => {
      if (percentage !== null && !isNaN(percentage)) {
        const validPercentage = Math.max(0, Math.min(100, percentage));
        setCurrentPercentage(validPercentage);
      }
      setCurrentPercentage(prev => {
        if (Math.abs(prev - percentage) < 1) {
          clearInterval(interval);
          return percentage;
        }
        return prev + (percentage - prev) * 0.08;
      });
    }, 40);

    return () => {
      setCurrentPercentage(0);
      clearInterval(interval);
    }
  }, [percentage]);

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
              <TreeGrowth
                percentage={currentPercentage}
              />
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
    color: "#06BF8B",
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
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  }
});

export default TreeGrowthSection;
