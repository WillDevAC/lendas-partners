import React from "react";
import { Breadcrumb } from "rsuite";
import { Link, useLocation } from "react-router-dom";

const BreadcrumbComponent: React.FC = () => {
  const location = useLocation();
  const segments = location.pathname
    .split("/")
    .filter((segment) => segment !== "");

  const isHomePage = location.pathname === "/";

  return (
    <Breadcrumb>
      {isHomePage ? (
        <Breadcrumb.Item active>Página principal /</Breadcrumb.Item>
      ) : (
        <Breadcrumb.Item>
          <Link to="/">Página principal</Link>
        </Breadcrumb.Item>
      )}
      {segments.map((segment, index) => (
        <Breadcrumb.Item key={index} active={index === segments.length - 1}>
          {segment}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};

export default BreadcrumbComponent;
