import type { Position } from "../../../types/userType";
import InputField from "../../ui/inputField";

type PositionTableProps = {
  defaultValue?: Position[];
  onCancel: () => void;
  onSubmit: (data: Position) => void;
};

export default function PositionForm({
  defaultValue,
  onCancel,
  onSubmit,
}: PositionTableProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget as HTMLFormElement);

    const data: Position = {
      id: defaultValue?.[0]?.id || 0,
      position_name: formData.get("position_name") as string,
      description: formData.get("description") as string,
    };

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <InputField
        label="Name"
        name="position_name"
        placeholder="exp: Perawat"
        defaultValue={defaultValue?.[0]?.position_name}
      />
      <InputField
        label="Description"
        name="description"
        placeholder="exp: Jabatan Perawat"
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
