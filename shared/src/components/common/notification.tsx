import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useMemo,
} from 'react';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  duration?: number;
}

export interface NotificationContextType {
  notifications: Notification[];
  showNotification: (
    message: string,
    type: NotificationType,
    duration?: number,
  ) => void;
  hideNotification: (id: string) => void;
}

export const NOTIFICATION_COLORS = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
  warning: 'bg-yellow-500',
} as const;

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotification must be used within a NotificationProvider',
    );
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
                                                                            children,
                                                                          }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback(
    (message: string, type: NotificationType = 'info', duration = 3000) => {
      const id = Date.now().toString();
      const newNotification = { id, message, type, duration };

      setNotifications((prev) => [...prev, newNotification]);

      if (duration > 0) {
        setTimeout(() => {
          hideNotification(id);
        }, duration);
      }

      return id;
    },
    [],
  );

  const hideNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id),
    );
  }, []);

  const contextValue = useMemo(
    () => ({
      notifications,
      showNotification,
      hideNotification,
    }),
    [notifications, showNotification, hideNotification],
  );

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <NotificationContainer
        notifications={notifications}
        hideNotification={hideNotification}
      />
    </NotificationContext.Provider>
  );
};

interface NotificationContainerProps {
  notifications: Notification[];
  hideNotification: (id: string) => void;
}

const NotificationContainer: React.FC<NotificationContainerProps> = ({
                                                                       notifications,
                                                                       hideNotification,
                                                                     }) => {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-xs">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={() => hideNotification(notification.id)}
        />
      ))}
    </div>
  );
};

interface NotificationItemProps {
  notification: Notification;
  onClose: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
                                                             notification,
                                                             onClose,
                                                           }) => {
  const { type, message } = notification;
  const bgColor = NOTIFICATION_COLORS[type];

  return (
    <div
      className={`${bgColor} text-white p-3 rounded-md shadow-md flex justify-between items-start animate-fade-in`}
    >
      <p className="text-sm">{message}</p>
      <button
        type="button"
        onClick={onClose}
        className="ml-2 text-white hover:text-gray-200 focus:outline-none"
        aria-label="Close notification"
      >
        ✕
      </button>
    </div>
  );
};

// Add animation styles
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 0.3s ease-out forwards;
  }
`;
document.head.appendChild(style);
