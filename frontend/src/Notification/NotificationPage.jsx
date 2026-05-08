import { useEffect, useState } from "react";
import axios from "axios";
import "./NotificationPage.css";
function NotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const API_URL =
    "http://4.224.186.213/evaluation-service/notifications";
  const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJ0aGFydW5pa2EuYWQyM0BiaXRzYXRoeS5hYy5pbiIsImV4cCI6MTc3ODIzNTAxNSwiaWF0IjoxNzc4MjM0MTE1LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiZjFhOTkyYjktYjdjMy00MjI4LTgwMjctMDA5YTcwZGUwMDdhIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoidGhhcnVuaWthIGsgcCIsInN1YiI6ImE4YTg0NTgzLTA1ZTItNDExOC05N2UyLTFhMmM0NzMyODZmZCJ9LCJlbWFpbCI6InRoYXJ1bmlrYS5hZDIzQGJpdHNhdGh5LmFjLmluIiwibmFtZSI6InRoYXJ1bmlrYSBrIHAiLCJyb2xsTm8iOiI3Mzc2MjMyYWQyNzMiLCJhY2Nlc3NDb2RlIjoidUthSmZtIiwiY2xpZW50SUQiOiJhOGE4NDU4My0wNWUyLTQxMTgtOTdlMi0xYTJjNDczMjg2ZmQiLCJjbGllbnRTZWNyZXQiOiJwSk5SeG1ZbUFIbUpQU2ZFIn0.4te8ESSxwNDiF-xR6s2-zWV8oFGO1jMo3GQKjCQ9hW8";
  const getWeight = (type) => {
    const weights = {
      Placement: 100,
      Result: 70,
      Event: 40,
    };

    return weights[type] || 10;
  };
  const calculatePriority = (notification) => {
    const currentTime = new Date();
    const notificationTime = new Date(notification.Timestamp);
    const minutesOld =
      (currentTime - notificationTime) / (1000 * 60);
    const recencyBoost = Math.max(50 - minutesOld, 0);

    return getWeight(notification.Type) + recencyBoost;
  };
  const fetchNotifications = async () => {
    try {
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      });

      const data = response.data;
      const updatedNotifications = data.map((notification) => ({
        ...notification,
        priorityScore: calculatePriority(notification),
      }));
      updatedNotifications.sort(
        (a, b) => b.priorityScore - a.priorityScore
      );
      const topNotifications =
        updatedNotifications.slice(0, 10);
      setNotifications(topNotifications);
    } catch (error) {
      console.log("Error fetching notifications:", error);
    }
  };
  useEffect(() => {
    fetchNotifications();
  }, []);
  return (
    <div className="container">
      <h1>Priority Inbox</h1>
      <div className="notification-list">
        {notifications.map((notification, index) => (
          <div className="card" key={notification.ID}>
            <h2>
              {index + 1}. {notification.Type}
            </h2>
            <p>{notification.Message}</p>
            <span>
              Priority Score:
              {" "}
              {notification.priorityScore.toFixed(2)}
            </span>
            <div className="time">
              {notification.Timestamp}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotificationPage;