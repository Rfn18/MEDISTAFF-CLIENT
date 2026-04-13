import type { Shift } from "../../../types/userType";
import InputField from "../../ui/inputField";

type ShiftFormProps = {
  defaultValue?: Shift[];
  onCancel: () => void;
  onSubmit: (data: Shift) => void;
};

export default function ShiftForm({
  defaultValue,
  onCancel,
  onSubmit,
}: ShiftFormProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget as HTMLFormElement);

    const data: Shift = {
      id: defaultValue?.[0]?.id || 0,
      shift_name: formData.get("shift_name") as string,
      start_time: formData.get("start_time") as string,
      end_time: formData.get("end_time") as string,
      description: formData.get("description") as string,
    };

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <InputField
        label="Nama Shift"
        name="shift_name"
        placeholder="exp: Pagi"
        defaultValue={defaultValue?.[0]?.shift_name}
      />
      <InputField
        label="Waktu Mulai"
        name="start_time"
        type="time"
        placeholder="exp: 07:00"
        defaultValue={defaultValue?.[0]?.start_time?.slice(0, 5)}
      />
      <InputField
        label="Waktu Selesai"
        name="end_time"
        type="time"
        placeholder="exp: 15:00"
        defaultValue={defaultValue?.[0]?.end_time?.slice(0, 5)}
      />
      <InputField
        label="Deskripsi"
        name="description"
        placeholder="exp: Shift pagi untuk pelayanan utama"
        defaultValue={defaultValue?.[0]?.description}
      />

      <div className="flex gap-2 mt-2">
        <button className="auth-gradient text-white w-30 px-4 py-2 rounded-md text-sm hover:-translate-y-1 hover:cursor-pointer transition">
          Simpan
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="bg-destructive/20 text-destructive w-30 px-4 py-2 rounded-md text-sm hover:-translate-y-1 hover:cursor-pointer hover:bg-destructive hover:text-white transition"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
