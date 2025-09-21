import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  Timestamp 
} from "firebase/firestore";
import { db } from "./firebase";
import type { Complaint, ComplaintTimelineItem } from "@/types";

export interface FirestoreComplaint extends Omit<Complaint, 'submissionDate' | 'lastUpdated'> {
  submissionDate: Timestamp;
  lastUpdated: Timestamp;
  userId: string;
}

export const complaintsService = {
  // Submit a new complaint
  async submitComplaint(complaintData: Omit<Complaint, 'complaintId' | 'submissionDate' | 'lastUpdated' | 'timeline'>, userId: string): Promise<Complaint> {
    try {
      const now = new Date();
      const complaintId = `GRV-${now.getFullYear()}-${String(Math.floor(Math.random() * 9999) + 1).padStart(3, '0')}`;

      const initialTimeline: ComplaintTimelineItem[] = [
        { 
          status: "Submitted", 
          date: now.toISOString(), 
          description: "Complaint received and registered" 
        }
      ];

      const firestoreComplaint: Omit<FirestoreComplaint, 'id'> = {
        complaintId,
        userId,
        userName: complaintData.userName,
        address: complaintData.address,
        issue: complaintData.issue,
        department: complaintData.department,
        status: "Submitted",
        submissionDate: Timestamp.fromDate(now),
        lastUpdated: Timestamp.fromDate(now),
        timeline: initialTimeline
      };

      await addDoc(collection(db, "complaints"), firestoreComplaint);

      // Convert back to regular Complaint format for the frontend
      const complaint: Complaint = {
        complaintId,
        userName: complaintData.userName,
        address: complaintData.address,
        issue: complaintData.issue,
        department: complaintData.department,
        status: "Submitted",
        submissionDate: now.toISOString(),
        lastUpdated: now.toISOString(),
        timeline: initialTimeline
      };

      return complaint;
    } catch (error: any) {
      console.error("Submit complaint error:", error);
      
      if (error.code === 'permission-denied') {
        throw new Error("Permission denied. Please check your Firestore security rules.");
      } else if (error.code === 'unavailable') {
        throw new Error("Service temporarily unavailable. Please try again later.");
      } else if (error.message?.includes('offline')) {
        throw new Error("You appear to be offline. Please check your internet connection and try again.");
      }
      
      throw new Error(error.message || "Failed to submit complaint. Please try again.");
    }
  },

  // Get all complaints for a user
  async getUserComplaints(userId: string): Promise<Complaint[]> {
    try {
      const q = query(
        collection(db, "complaints"),
        where("userId", "==", userId),
        orderBy("submissionDate", "desc")
      );

      const querySnapshot = await getDocs(q);

      const complaints: Complaint[] = [];

      querySnapshot.forEach((doc: any) => {
        const data = doc.data() as FirestoreComplaint;
        const complaint: Complaint = {
          complaintId: data.complaintId,
          userName: data.userName,
          address: data.address,
          issue: data.issue,
          department: data.department,
          status: data.status,
          submissionDate: data.submissionDate.toDate().toISOString(),
          lastUpdated: data.lastUpdated.toDate().toISOString(),
          timeline: data.timeline
        };
        complaints.push(complaint);
      });

      return complaints;
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch complaints");
    }
  },

  // Get a specific complaint by ID
  async getComplaintById(complaintId: string): Promise<Complaint | null> {
    try {
      const q = query(
        collection(db, "complaints"),
        where("complaintId", "==", complaintId)
      );

      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }

      const doc = querySnapshot.docs[0];
      const data = doc.data() as FirestoreComplaint;

      const complaint: Complaint = {
        complaintId: data.complaintId,
        userName: data.userName,
        address: data.address,
        issue: data.issue,
        department: data.department,
        status: data.status,
        submissionDate: data.submissionDate.toDate().toISOString(),
        lastUpdated: data.lastUpdated.toDate().toISOString(),
        timeline: data.timeline
      };

      return complaint;
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch complaint");
    }
  },

  // Update complaint status (for admin use)
  async updateComplaintStatus(complaintId: string, newStatus: string, description: string): Promise<void> {
    try {
      const q = query(
        collection(db, "complaints"),
        where("complaintId", "==", complaintId)
      );

      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        throw new Error("Complaint not found");
      }

      const docRef = querySnapshot.docs[0].ref;
      const docData = querySnapshot.docs[0].data() as FirestoreComplaint;

      const newTimelineItem: ComplaintTimelineItem = {
        status: newStatus,
        date: new Date().toISOString(),
        description: description
      };

      const updatedTimeline = [...docData.timeline, newTimelineItem];

      await updateDoc(docRef, {
        status: newStatus,
        lastUpdated: Timestamp.now(),
        timeline: updatedTimeline
      });
    } catch (error: any) {
      throw new Error(error.message || "Failed to update complaint status");
    }
  },

  // Get all complaints (for admin dashboard)
  async getAllComplaints(): Promise<Complaint[]> {
    try {
      const q = query(
        collection(db, "complaints"),
        orderBy("submissionDate", "desc")
      );

      const querySnapshot = await getDocs(q);
      const complaints: Complaint[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data() as FirestoreComplaint;
        const complaint: Complaint = {
          complaintId: data.complaintId,
          userName: data.userName,
          address: data.address,
          issue: data.issue,
          department: data.department,
          status: data.status,
          submissionDate: data.submissionDate.toDate().toISOString(),
          lastUpdated: data.lastUpdated.toDate().toISOString(),
          timeline: data.timeline
        };
        complaints.push(complaint);
      });

      return complaints;
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch all complaints");
    }
  }
};
