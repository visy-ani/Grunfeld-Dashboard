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

const CollectionScrollContainer: React.FC<{ collection: Collection }> = ({ collection }) => {
  return (
    <div className={styles.collectionContainer}>
      <h2 className={styles.collectionTitle}>{collection.name}</h2>
      <div className={styles.scrollContainerWrapper}>
        <div className={styles.scrollContainer}>
          {collection.items.map((item, index) => {
            const rarity = Object.keys(item)[0];
            const badgeUrl = item[rarity];
            return (
              <Image
                key={index}
                className={styles.item}
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

const MultiCollectionCard: React.FC<MultiCollectionCardProps> = ({ collections }) => {
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
