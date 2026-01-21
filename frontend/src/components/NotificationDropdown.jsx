import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import { 
  Bell, Check, CheckCheck, Trash2, ExternalLink,
  ShoppingBag, GraduationCap, MessageSquare, Info,
  AlertCircle, Gift, Loader2, BellOff
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/notifications`, {
        params: { limit: 10 },
        withCredentials: true
      });
      setNotifications(response.data.notifications);
      setUnreadCount(response.data.unread_count);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/notifications/unread-count`, {
        withCredentials: true
      });
      setUnreadCount(response.data.unread_count);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  }, []);

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (open) {
      fetchNotifications();
    }
  }, [open, fetchNotifications]);

  // Poll for unread count every 30 seconds
  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`${API}/notifications/${notificationId}/read`, {}, {
        withCredentials: true
      });
      setNotifications(prev => 
        prev.map(n => 
          n.notification_id === notificationId ? { ...n, is_read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put(`${API}/notifications/read-all`, {}, {
        withCredentials: true
      });
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Failed to mark all as read:', error);
      toast.error('Failed to mark notifications as read');
    }
  };

  const deleteNotification = async (notificationId, e) => {
    e.stopPropagation();
    try {
      await axios.delete(`${API}/notifications/${notificationId}`, {
        withCredentials: true
      });
      setNotifications(prev => prev.filter(n => n.notification_id !== notificationId));
      toast.success('Notification deleted');
    } catch (error) {
      console.error('Failed to delete notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  const clearAll = async () => {
    try {
      await axios.delete(`${API}/notifications`, {
        withCredentials: true
      });
      setNotifications([]);
      setUnreadCount(0);
      toast.success('All notifications cleared');
    } catch (error) {
      console.error('Failed to clear notifications:', error);
      toast.error('Failed to clear notifications');
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      purchase: ShoppingBag,
      enrollment: GraduationCap,
      message: MessageSquare,
      system: Info,
      alert: AlertCircle,
      promotion: Gift,
    };
    const Icon = icons[type] || Bell;
    return <Icon className="w-4 h-4" />;
  };

  const getNotificationColor = (type) => {
    const colors = {
      purchase: 'bg-green-500/10 text-green-500',
      enrollment: 'bg-cyan-500/10 text-cyan-500',
      message: 'bg-blue-500/10 text-blue-500',
      system: 'bg-purple-500/10 text-purple-500',
      alert: 'bg-red-500/10 text-red-500',
      promotion: 'bg-amber-500/10 text-amber-500',
    };
    return colors[type] || 'bg-gray-500/10 text-gray-500';
  };

  const formatTime = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-96 p-0" 
        align="end"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-cyan-500" />
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-500 text-xs rounded-full font-medium">
                {unreadCount} new
              </span>
            )}
          </div>
          {notifications.length > 0 && (
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={markAllAsRead}
                className="text-xs h-8"
                disabled={unreadCount === 0}
              >
                <CheckCheck className="w-3 h-3 mr-1" />
                Read all
              </Button>
            </div>
          )}
        </div>

        {/* Notifications List */}
        <ScrollArea className="h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <BellOff className="w-8 h-8 text-muted-foreground" />
              </div>
              <h4 className="font-medium mb-1">No notifications</h4>
              <p className="text-sm text-muted-foreground">
                You're all caught up! We'll notify you when something new happens.
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <motion.div
                  key={notification.notification_id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 hover:bg-muted/50 transition-colors cursor-pointer group relative ${
                    !notification.is_read ? 'bg-cyan-500/5' : ''
                  }`}
                  onClick={() => !notification.is_read && markAsRead(notification.notification_id)}
                >
                  <div className="flex gap-3">
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${getNotificationColor(notification.type)}`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={`text-sm font-medium line-clamp-1 ${!notification.is_read ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {notification.title}
                        </h4>
                        {!notification.is_read && (
                          <span className="w-2 h-2 bg-cyan-500 rounded-full shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">
                          {formatTime(notification.created_at)}
                        </span>
                        {notification.action_url && (
                          <Link 
                            to={notification.action_url}
                            className="text-xs text-cyan-500 hover:text-cyan-400 flex items-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            View <ExternalLink className="w-3 h-3" />
                          </Link>
                        )}
                      </div>
                    </div>
                    
                    {/* Delete button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 top-2"
                      onClick={(e) => deleteNotification(notification.notification_id, e)}
                    >
                      <Trash2 className="w-4 h-4 text-muted-foreground hover:text-red-500" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        {notifications.length > 0 && (
          <>
            <Separator />
            <div className="p-3 flex items-center justify-between">
              <Link 
                to="/dashboard/notifications"
                className="text-sm text-cyan-500 hover:text-cyan-400 font-medium"
                onClick={() => setOpen(false)}
              >
                View all notifications
              </Link>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={clearAll}
                className="text-xs text-muted-foreground hover:text-red-500"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Clear all
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationDropdown;
