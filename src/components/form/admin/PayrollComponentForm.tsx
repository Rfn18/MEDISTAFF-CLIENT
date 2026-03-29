import { Loader2 } from "lucide-react";
import type { Allowance, Deduction } from "../../../types/payrollType";
import InputField from "../../ui/inputField";
import { toRupiah } from "../../../utils/toRupiah";

type AllowanceFormProps = {
  defaultValue?: Allowance[];
  onCancel: () => void;
  onSubmit: (data: Allowance) => void;
  loading: boolean;
};

type DeductionFormProps = {
  defaultValue?: Deduction[];
  onCancel: () => void;
  onSubmit: (data: Deduction) => void;
  loading: boolean;
};

export function AllowanceForm({
  defaultValue,
  onCancel,
  onSubmit,
  loading,
}: AllowanceFormProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget as HTMLFormElement);

    const data: Allowance = {
      id: defaultValue?.[0]?.id || 0,
      allowance_name: formData.get("allowance_name") as string,
      amount: Number(formData.get("amount")),
      description: formData.get("description") as string,
    };

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <InputField
        label="Name"
        name="allowance_name"
        placeholder="exp: Tunjangan Jabatan"
        defaultValue={defaultValue?.[0]?.allowance_name}
      />
      <InputField
        label="Description"
        name="description"
        placeholder="exp: Tunjangan Jabatan Staff"
        defaultValue={defaultValue?.[0]?.description}
      />
      <InputField
        label="Amount"
        name="amount"
        placeholder="exp: 1000000"
        defaultValue={defaultValue?.[0]?.amount}
      />

      <div className="flex gap-2 mt-2">
        <button
          type="submit"
          disabled={loading}
          className="disabled:opacity-50 disabled:cursor-not flex items-center justify-center auth-gradient text-white w-30 px-4 py-2 rounded-md text-sm hover:-translate-y-1 hover:cursor-pointer transition"
        >
          {loading ? <Loader2 className="animate-spin" /> : "Simpan"}
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

export function DeductionForm({
  defaultValue,
  onCancel,
  onSubmit,
  loading,
}: DeductionFormProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget as HTMLFormElement);

    const data: Deduction = {
      id: defaultValue?.[0]?.id || 0,
      deduction_name: formData.get("deduction_name") as string,
      amount: Number(formData.get("amount")),
      description: formData.get("description") as string,
    };

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <InputField
        label="Name"
        name="deduction_name"
        placeholder="exp: Potongan BPJS"
        defaultValue={defaultValue?.[0]?.deduction_name}
      />
      <InputField
        label="Description"
        name="description"
        placeholder="exp: Potongan BPJS Kesehatan"
        defaultValue={defaultValue?.[0]?.description}
      />
      <InputField
        label="Amount"
        name="amount"
        placeholder={`exp: ${toRupiah(50000)}`}
        defaultValue={defaultValue?.[0]?.amount}
      />

      <div className="flex gap-2 mt-2">
        <button
          type="submit"
          disabled={loading}
          className="disabled:opacity-50 disabled:cursor-not flex items-center justify-center auth-gradient text-white w-30 px-4 py-2 rounded-md text-sm hover:-translate-y-1 hover:cursor-pointer transition"
        >
          {loading ? <Loader2 className="animate-spin" /> : "Simpan"}
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
