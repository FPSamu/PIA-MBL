import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useFonts, Inter_600SemiBold } from "@expo-google-fonts/inter";
import GraphBar from "../components/GraphBar";
import { ensureValidSession } from "../../services/session";
import { supabase } from "../../onboarding/services/supabaseClient";

const Y_AXIS_LABELS = ["100%", "75%", "50%", "25%", "0%"];

export default function Spending() {
  const [categoryPercentages, setCategoryPercentages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryPercentages = async () => {
      setLoading(true);
      const session = await ensureValidSession();

      if (!session?.user?.id) {
        setCategoryPercentages([]);
        setLoading(false);
        return;
      }

      // Paso 1: Fechas del mes actual
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const now = new Date();

      // Paso 2: Obtener transacciones del mes actual (sin 'Income')
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("uid", session.user.id)
        .gte("date", startOfMonth.toISOString())
        .lte("date", now.toISOString())
        .neq("category", "Income");

      if (error || !data) {
        setCategoryPercentages([]);
        setLoading(false);
        return;
      }

      const totalAmount = data.reduce((acc, tx) => acc + tx.amount, 0);

      const grouped: Record<string, number> = {};
      data.forEach((tx) => {
        if (!grouped[tx.category]) {
          grouped[tx.category] = 0;
        }
        grouped[tx.category] += tx.amount;
      });

      const percentages = Object.entries(grouped).map(([category, sum]) => ({
        category,
        porcentaje: Math.round(Math.abs((sum * 100) / totalAmount) * 100) / 100,
      }));

      setCategoryPercentages(percentages);
      setLoading(false);
    };

    fetchCategoryPercentages();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Monthly Spending</Text>

      {loading ? (
        // <Text style={styles.loadingText}>Loading...</Text>
        <Text>Loading...</Text>
      ) : (
        <View style={styles.card}>
          <View style={styles.chartWrapper}>
            <View style={styles.yAxis}>
              {Y_AXIS_LABELS.map((label) => (
                <View key={label} style={styles.yAxisLabelContainer}>
                  <Text style={styles.yAxisLabel}>{label}</Text>
                  <View style={styles.gridLine} />
                </View>
              ))}
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              <View style={styles.graphContainer}>
                {categoryPercentages.map((item) => (
                  <GraphBar
                    key={item.category}
                    category={item.category}
                    percentage={item.porcentaje}
                    maxHeight={180}
                  />
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  );
}

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
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  chartWrapper: {
    height: 230,
    flexDirection: "row",
  },
  yAxis: {
    width: 40,
    height: 200,
    justifyContent: "space-between",
    marginRight: 8,
    zIndex: 0,
  },
  yAxisLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 20,
  },
  yAxisLabel: {
    fontSize: 10,
    color: "#666",
    width: 35,
    textAlign: "right",
  },
  gridLine: {
    position: "absolute",
    left: 40,
    right: -300,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  scrollContent: {
    paddingRight: 16,
  },
  graphContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    // height: 200,
    gap: 24,
    paddingTop: 10,
  },
});
