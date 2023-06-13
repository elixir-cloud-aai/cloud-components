import React, { useState } from "react";
import { Button, Card, Spacer } from "@nextui-org/react";
import styles from "./sidebar.module.css";

interface SidebarItem {
  title: string;
  content: React.ReactNode;
}

interface SidebarProps {
  items: SidebarItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ items }) => {
  const [activeItem, setActiveItem] = useState<SidebarItem>(items[0]);

  const openItem = (item: SidebarItem) => {
    setActiveItem(item);
  };

  return (
    <Card variant="bordered" className={styles.sidebar}>
      <Card.Body className={styles.buttons}>
        {items.map((item) => (
          <div key={item.title}>
            <Button
              auto
              light
              flat={activeItem === item}
              color={activeItem === item ? "primary" : "default"}
              onClick={() => openItem(item)}
            >
              {item.title}
            </Button>
            <Spacer y={0.5} />
          </div>
        ))}
      </Card.Body>
      <Card.Body className={styles.sidebarContent}>
        {activeItem.content}
      </Card.Body>
    </Card>
  );
};

export default Sidebar;
