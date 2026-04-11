import React from "react";
import ActionCard from "../../components/dashboard/ActionCard";
import { Typography } from "antd";
import StatCard from "../../components/dashboard/StatCard";

const { Title } = Typography;

const dashboardSections = [
  {
    title: "Inzeráty",
    actions: [
      { path: "/listings/edit", purpose: "Spravovat inzeráty" },
      { path: "/listings/create", purpose: "Vytvořit nový inzerát" },
    ],
    stats: {
      title: "Nejnovější inzerát",
      created: "2024-06-01T12:00:00Z",
      visibility: true,
      index: 123,
    },
  },
  {
    title: "Aktuality",
    actions: [
      { path: "/news", purpose: "Spravovat aktuality" },
      { path: "/news/create", purpose: "Vytvořit nový článek" },
    ],
    stats: {
      title: "Nejnovější aktualita",
      created: "2024-06-01T12:00:00Z",
      visibility: true,
    },
  },
  {
    title: "Formuláře",
    actions: [{ path: "/forms", purpose: "Spravovat formuláře" }],
    stats: {
      title: "Jan Novák",
      created: "2024-06-01T12:00:00Z",
      amountNew: 5,
      amountUnprocessed: 2,
    },
  },
];
function DisplaySection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 32 }}>
      <Title level={3}>{title}</Title>
      <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
        {children}
      </div>
    </div>
  );
}
const DashboardPage: React.FC = () => {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1110);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return (
    <div className="dashboard-page">
      {dashboardSections.map((section) => (
        <DisplaySection key={section.title} title={section.title}>
          <div
            style={
              isMobile
                ? {
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                    width: "100%",
                    alignItems: "stretch",
                  }
                : {
                    display: "grid",
                    gridTemplateColumns: "repeat(1, 520px) 1fr",
                    gap: 8,
                    width: "100%",
                    alignItems: "stretch",
                  }
            }
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 8,
                maxWidth: 520,
                width: "100%",
                flexWrap: "wrap",
              }}
            >
              {section.actions.map((action) => (
                <div key={action.path}>
                  <ActionCard {...action} />
                </div>
              ))}
            </div>

            {section.stats && (
              <div
                style={{
                  flex: isMobile ? "0 0 300px" : "1 1 auto",
                  width: isMobile ? 300 : "100%",
                  minWidth: 300,
                }}
              >
                <StatCard {...section.stats} />
              </div>
            )}
          </div>
        </DisplaySection>
      ))}
    </div>
  );
};
export default DashboardPage;
