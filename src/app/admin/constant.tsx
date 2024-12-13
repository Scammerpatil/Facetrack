import {
  HomeIcon,
  User,
  FileText,
  History,
  Settings,
  Clipboard,
  CheckCircle,
  UserPlus,
} from "lucide-react";
import { SideNavItem } from "@/types/types";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Dashboard",
    path: "/admin/dashboard",
    icon: <HomeIcon width="24" height="24" />,
  },
  {
    title: "Enroll New Student",
    path: "/admin/enroll",
    icon: <UserPlus width="24" height="24" />,
  },
  {
    title: "Mark Attendance",
    path: "/admin/mark-attendance",
    icon: <CheckCircle width="24" height="24" />,
  },
  {
    title: "Track Attendance",
    path: "/admin/track-attendance",
    icon: <History width="24" height="24" />,
  },
  {
    title: "Student History",
    path: "/admin/student-history",
    icon: <FileText width="24" height="24" />,
  },
];
