import React, { useRef } from "react";
import styles from "@/styles/Collections.module.css";
import Image from "next/image";
import hawkeye from "@/public/Hawkeye.svg";

interface Item {
  common?: string;
  rare?: string;
  epic?: string;
  legendary?: string;
}

interface Collection {
  name: string;
  items: Item[];
}

interface CollectionScrollContainerProps {
  collection: Collection;
}

const rarityColors: { [key: string]: string } = {
  common: "rgba(43, 0, 255, 0.5)",
  rare: "rgba(0, 255, 42, 0.276)",
  epic: "rgba(64, 29, 107, 0.584)",
  legendary: "rgba(222, 78, 16, 0.584)",
};

const CollectionScrollContainer: React.FC<CollectionScrollContainerProps> = ({
  collection,
}) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className={styles.collectionContainer}>
      <h2 className={styles.collectionTitle}>{collection.name}</h2>

      <div className={styles.scrollContainerWrapper}>
        <div ref={scrollRef} className={styles.scrollContainer}>
          {collection.items.map((item, index) => {
            const rarity = Object.keys(item)[0]; // Get rarity key
            const glowColor = rarityColors[rarity] || "rgba(0, 0, 0, 0)"; // Default to no glow

            return (
              <Image
                key={index}
                className={styles.item}
                src={hawkeye}
                width={300}
                height={400}
                style={{
                  filter: `blur(0) drop-shadow(0 4px 16px ${glowColor})`,
                }}
                alt={`Item ${index} (${rarity})`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

interface MultiCollectionCardProps {
  collections: Collection[];
}

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

const Collections: React.FC = () => {
  const sampleCollections: Collection[] = [
    {
      name: "Superhero Collection",
      items: [
        { common: "url" },
        { rare: "url" },
        { epic: "url" },
        { legendary: "url" },
      ],
    },
    {
      name: "Villain Collection",
      items: [
        { common: "url" },
        { rare: "url" },
        { epic: "url" },
        { legendary: "url" },
      ],
    },
  ];

  return <MultiCollectionCard collections={sampleCollections} />;
};

export default Collections;
