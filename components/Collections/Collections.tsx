"use client";

import React from "react";
import styles from "@/styles/Collections.module.css";
import Image from "next/image";
import { useUserCollections } from "@/hooks/useUserCollections";

interface Collection {
  name: string;
  items: Array<{ [key: string]: string }>;
}

interface MultiCollectionCardProps {
  collections: Collection[];
}

const CollectionScrollContainer: React.FC<{ collection: Collection }> = ({
  collection,
}) => {
  const rarityOrder = ["Common", "Rare", "Epic", "Legendary"];

  const sortedItems = collection.items.sort((a, b) => {
    const keyA = Object.keys(a)[0]; 
    const keyB = Object.keys(b)[0];

    return rarityOrder.indexOf(keyA) - rarityOrder.indexOf(keyB);
  });

  return (
    <div className={styles.collectionContainer}>
      <h2 className={styles.collectionTitle}>{collection.name}</h2>
      <div className={styles.scrollContainerWrapper}>
        <div className={styles.scrollContainer}>
          {sortedItems.map((item, index) => {
            const rarity = Object.keys(item)[0];
            const badgeUrl = item[rarity];
            const glowClasses = [
              styles.commonGlow,
              styles.rareGlow,
              styles.epicGlow,
              styles.legendaryGlow,
            ];

            return (
              <Image
                key={index}
                className={`${styles.item} ${glowClasses[index % 4]}`}
                src={badgeUrl}
                width={300}
                height={400}
                alt={`Badge ${index} (${rarity})`}
                priority
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

const MultiCollectionCard: React.FC<MultiCollectionCardProps> = ({
  collections,
}) => {
  return (
    <div className={styles.multiCollectionCard}>
      {collections.map((collection, index) => (
        <CollectionScrollContainer key={index} collection={collection} />
      ))}
    </div>
  );
};

const Collections: React.FC<{ rollNumber: string }> = ({ rollNumber }) => {
  const { collections, loading } = useUserCollections(rollNumber);

  if (loading) return <p>Loading collections...</p>;
  if (collections.length === 0) return <p>No badges allocated yet.</p>;

  return <MultiCollectionCard collections={collections} />;
};

export default Collections;
