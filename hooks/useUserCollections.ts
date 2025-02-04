"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export interface Badge {
  id: string;
  roll_number: string;
  allocated_url: string;
  collection_name: string;
  allocated_at: string;
  rarity: "common" | "rare" | "epic" | "legendary"; // Ensure this column exists in your table
}

export interface Collection {
  name: string;
  items: Array<{ [key: string]: string }>; // Each item: e.g. { common: "url" }
}

export const useUserCollections = (rollNumber: string) => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCollections = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("user_badges")
        .select("*")
        .eq("roll_number", rollNumber);
      if (error) {
        console.error("Error fetching badges:", error);
        setLoading(false);
        return;
      }
      // Group badges by collection_name.
      const groups: Record<string, Badge[]> = {};
      (data || []).forEach((badge: Badge) => {
        if (!groups[badge.collection_name]) {
          groups[badge.collection_name] = [];
        }
        groups[badge.collection_name].push(badge);
      });
      // Build the collections array.
      // For each collection, we create an object where items is an array of badge objects.
      const builtCollections: Collection[] = Object.keys(groups).map((collectionName) => {
        const items = groups[collectionName].map((badge) => ({
          [badge.rarity]: badge.allocated_url,
        }));
        return {
          name: `${collectionName} Collection`,
          items,
        };
      });
      setCollections(builtCollections);
      setLoading(false);
    };

    if (rollNumber) {
      fetchCollections();
    }
  }, [rollNumber]);

  return { collections, loading };
};
