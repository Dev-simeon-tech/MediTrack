// export type Patient = {
//   id: string;
//   hospitalNo: string;
//   name: string;
//   dob: Date;
//   sex: string;
//   phone?: string;
//   address?: string;
//   emergencyName?: string;
//   emergencyPhone?: string;
//   bloodGroup?: string;
//   allergies?: string[];
//   chronicConditions: string[];
//   createdAt: string;
//   updatedAt: string;
// };
export type Patient = {
 encounters: Record<string, unknown>[];
 vitals: Record<string, unknown>[];
 appointments: Record<string, unknown>[];
 documents: Record<string, unknown>[];
 id: string;
 hospitalNo: string;
 name: string;
 dob: Date;
 sex: "MALE" | "FEMALE";
 phone: string | null;
 address: string | null;
 emergencyName: string | null;
 emergencyPhone: string | null;
 bloodGroup: string | null;
 allergies: string[];
 chronicConditions: string[];
 createdAt: Date;
 updatedAt: Date;
}

