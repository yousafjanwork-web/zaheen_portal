const EXTERNAL_PORTALS = ["/issb", "/nat"];

export const isExternalPortal = (path: string) =>
  EXTERNAL_PORTALS.some(p => path === p || path.startsWith(p + "/"));

export const goToPortal = (
  path: string,
  navigate: (to: string, opts?: { replace?: boolean }) => void
) => {
  if (isExternalPortal(path)) {
    window.location.replace(path.endsWith("/") ? path : path + "/");
  } else {
    navigate(path, { replace: true });
  }
};