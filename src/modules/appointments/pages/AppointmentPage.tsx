import { AppointmentRegistry } from "@/modules/appointments/components/AppointmentRegistry";
import type {
	AppointmentPatientOption,
} from "@/modules/appointments/components/CreateAppointmentDialog";
import type { AppointmentRecord } from "@/modules/appointments/components/AppointmentRegistry";

export default function AppointmentPage({
	appointments,
	patients,
}: {
	appointments: AppointmentRecord[];
	patients: AppointmentPatientOption[];
}) {
	return <AppointmentRegistry appointments={appointments} patients={patients} />;
}
