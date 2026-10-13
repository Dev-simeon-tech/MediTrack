export type PatientDirectoryRecord = {
  id: string;
  hospitalNo: string;
  name: string;
  dob: string;
  sex: "MALE" | "FEMALE";
  phone: string | null;
  bloodGroup: string | null;
  allergies: string[];
  chronicConditions: string[];
  createdAt: string;
  lastVisit: string | null;
};

export type PatientDirectoryResponse = {
  patients: PatientDirectoryRecord[];
  conditions: string[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};
