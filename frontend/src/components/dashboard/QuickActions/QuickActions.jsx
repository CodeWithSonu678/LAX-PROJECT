import { useNavigate } from "react-router";

import {
  Play,
  Settings,
  Clock,
  ChevronRight,
} from "lucide-react";

import styles from "./QuickActions.module.css";

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      id: 1,
      title: "Send Command",
      icon: Play,
      path: "/devices",
    },
    {
      id: 2,
      title: "Open Device Settings",
      icon: Settings,
      path: "/settings",
    },
    {
      id: 3,
      title: "View Activity Logs",
      icon: Clock,
      path: "/activity",
    },
  ];

  return (
    <section className={styles.actionsCard}>

      <h2>Quick Actions</h2>

      <div className={styles.actionList}>
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.id}
              className={styles.actionButton}
              onClick={() => navigate(action.path)}
            >
              <Icon size={19} />

              <span>{action.title}</span>

              <ChevronRight size={18} className={styles.arrow} />
            </button>
          );
        })}
      </div>

    </section>
  );
};

export default QuickActions;