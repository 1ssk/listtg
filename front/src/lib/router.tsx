import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface RouterContextType {
  currentPath: string;
  navigate: (path: string) => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export function Router({ children }: { children: ReactNode }) {
  const [currentPath, setCurrentPath] = useState(
    window.location.hash.slice(1) || "/"
  );

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash.slice(1) || "/");
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigate = (path: string) => {
    window.location.hash = path;
  };

  return (
    <RouterContext.Provider value={{ currentPath, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error("useRouter must be used within a Router");
  }
  return context;
}

export function Link({ to, children, className, ...props }: { to: string; children: ReactNode; className?: string; [key: string]: any }) {
  const { navigate } = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(to);
  };

  return (
    <a href={`#${to}`} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  );
}

export function Routes({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function Route({ path, element }: { path: string; element: ReactNode }) {
  const { currentPath } = useRouter();
  
  if (currentPath === path) {
    return <>{element}</>;
  }
  
  return null;
}
