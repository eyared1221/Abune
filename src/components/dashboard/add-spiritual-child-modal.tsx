"use client";

import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import {
  CalendarDays,
  Cross,
  Phone,
  Plus,
  Save,
  Trash2,
  Users,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ChildRow = {
  id: number;
  name: string;
  gender: string;
  dateOfBirth: string;
};

export type NewSpiritualChildSubmission = {
  baptismalName: string;
  gender: string;
  dateOfBirth: string;
  phoneNumber: string;
  occupation: string;
  educationalLevel: string;
  maritalStatus: string;
  spiritualChildJoinedDate: string;
  spouseName: string;
  children: ChildRow[];
  emergencyContactName: string;
  emergencyRelationship: string;
  emergencyPhoneNumber: string;
};

type AddSpiritualChildModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (submission: NewSpiritualChildSubmission) => void;
};

const fieldClassName =
  "h-[54px] w-full rounded-[16px] border border-[#e5dece] bg-white px-4 text-[15px] font-medium text-[#253252] outline-none transition-all placeholder:text-[#9ca5b5] focus:border-[#c5a860] focus:ring-4 focus:ring-[#d7b04d]/10";

const selectClassName = cn(
  fieldClassName,
  "appearance-none bg-[linear-gradient(45deg,transparent_50%,#6f7895_50%),linear-gradient(135deg,#6f7895_50%,transparent_50%)] bg-[position:calc(100%-22px)_calc(50%-2px),calc(100%-16px)_calc(50%-2px)] bg-[size:6px_6px,6px_6px] bg-no-repeat pr-12",
);

const sectionTitleClassName =
  "border-b border-[#eee6d8] pb-4 text-[15px] font-extrabold text-[#1e2952] sm:text-[18px]";

function createChildRow(): ChildRow {
  return {
    id: Date.now() + Math.floor(Math.random() * 1000),
    name: "",
    gender: "",
    dateOfBirth: "",
  };
}

function FieldLabel({
  label,
  required = false,
}: {
  label: string;
  required?: boolean;
}) {
  return (
    <label className="mb-2 block text-sm font-bold text-[#33415f]">
      {label}
      {required ? <span className="ml-1 text-[#db5d5d]">*</span> : null}
    </label>
  );
}

function InputWithIcon({
  className,
  icon,
  inputClassName,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  icon: ReactNode;
  inputClassName?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-[54px] items-center gap-3 rounded-[16px] border border-[#e5dece] bg-white px-4 transition-all focus-within:border-[#c5a860] focus-within:ring-4 focus-within:ring-[#d7b04d]/10",
        className,
      )}
    >
      <span className="shrink-0 text-[#6f7895]">{icon}</span>
      <input
        {...props}
        className={cn(
          "w-full bg-transparent text-[15px] font-medium text-[#253252] outline-none placeholder:text-[#9ca5b5]",
          inputClassName,
        )}
      />
    </div>
  );
}

export function AddSpiritualChildModal({
  open,
  onClose,
  onSave,
}: AddSpiritualChildModalProps) {
  const [baptismalName, setBaptismalName] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [occupation, setOccupation] = useState("");
  const [educationalLevel, setEducationalLevel] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [spiritualChildJoinedDate, setSpiritualChildJoinedDate] = useState("");
  const [spouseName, setSpouseName] = useState("");
  const [children, setChildren] = useState<ChildRow[]>([]);
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyRelationship, setEmergencyRelationship] = useState("");
  const [emergencyPhoneNumber, setEmergencyPhoneNumber] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  const addChildRow = () => {
    setChildren((currentChildren) => [...currentChildren, createChildRow()]);
  };

  const updateChildRow = (
    id: number,
    key: keyof Omit<ChildRow, "id">,
    value: string,
  ) => {
    setChildren((currentChildren) =>
      currentChildren.map((child) =>
        child.id === id ? { ...child, [key]: value } : child,
      ),
    );
  };

  const removeChildRow = (id: number) => {
    setChildren((currentChildren) =>
      currentChildren.filter((child) => child.id !== id),
    );
  };

  const handlePhoneChange =
    (setter: (value: string) => void) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setter(event.target.value);
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSave({
      baptismalName,
      gender,
      dateOfBirth,
      phoneNumber,
      occupation,
      educationalLevel,
      maritalStatus,
      spiritualChildJoinedDate,
      spouseName,
      children: children.filter(
        (child) =>
          child.name.trim() !== "" ||
          child.gender.trim() !== "" ||
          child.dateOfBirth.trim() !== "",
      ),
      emergencyContactName,
      emergencyRelationship,
      emergencyPhoneNumber,
    });
  };

  const isSpouseFieldEnabled = maritalStatus === "Married";

  return (
    <div className="fixed inset-0 z-[80]">
      <button
        aria-label="Close add spiritual child form"
        className="absolute inset-0 bg-[#17223f]/45 backdrop-blur-[3px]"
        onClick={onClose}
        type="button"
      />

      <div className="relative flex min-h-full items-center justify-center p-4 lg:p-8">
        <div className="relative z-10 w-full max-w-[1040px] overflow-hidden rounded-[28px] border border-[#ece4d6] bg-[#fdfcf9] shadow-[0_32px_80px_rgba(17,24,39,0.24)]">
          <form
            className="max-h-[92vh] overflow-y-auto"
            onSubmit={handleSubmit}
          >
            <div className="px-5 pb-6 pt-5 sm:px-7 sm:pb-7 sm:pt-6 lg:px-10">
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#eadfc9] bg-[#fbf6ec] text-[#ba9642] shadow-[0_8px_18px_rgba(185,150,69,0.12)]">
                    <Cross className="h-7 w-7" strokeWidth={1.8} />
                  </div>

                  <div>
                    <h2 className="text-[28px] font-extrabold leading-tight text-[#1c2850]">
                      Add Spiritual Child
                    </h2>

                    <p className="mt-1 text-sm font-medium text-[#73809b]">
                      Register a new spiritual child under your guidance.
                    </p>
                  </div>
                </div>

                <button
                  aria-label="Close form"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#6d7690] transition-colors hover:bg-[#f4efe4] hover:text-[#1c2850]"
                  onClick={onClose}
                  type="button"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-8 space-y-8">
                <section>
                  <h3 className={sectionTitleClassName}>
                    1. Personal Information
                  </h3>

                  <div className="mt-6 grid gap-5 lg:grid-cols-3">
                    <div>
                      <FieldLabel label="Baptismal (Christian) Name" required />
                      <input
                        className={fieldClassName}
                        onChange={(event) => setBaptismalName(event.target.value)}
                        placeholder="Enter baptismal name"
                        required
                        value={baptismalName}
                      />
                    </div>

                    <div>
                      <FieldLabel label="Gender" required />
                      <select
                        className={selectClassName}
                        onChange={(event) => setGender(event.target.value)}
                        required
                        value={gender}
                      >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>

                    <div>
                      <FieldLabel label="Date of Birth" required />
                      <InputWithIcon
                        icon={<CalendarDays className="h-5 w-5" />}
                        onChange={(event) => setDateOfBirth(event.target.value)}
                        placeholder="Select date"
                        required
                        type={dateOfBirth ? "date" : "text"}
                        onFocus={(event) => {
                          event.currentTarget.type = "date";
                        }}
                        onBlur={(event) => {
                          if (!event.currentTarget.value) {
                            event.currentTarget.type = "text";
                          }
                        }}
                        value={dateOfBirth}
                      />
                    </div>

                    <div>
                      <FieldLabel label="Phone Number" required />
                      <InputWithIcon
                        icon={<Phone className="h-5 w-5" />}
                        onChange={handlePhoneChange(setPhoneNumber)}
                        placeholder="0912 345 678"
                        required
                        type="tel"
                        value={phoneNumber}
                      />
                    </div>

                    <div>
                      <FieldLabel label="Occupation" />
                      <input
                        className={fieldClassName}
                        onChange={(event) => setOccupation(event.target.value)}
                        placeholder="Enter occupation"
                        value={occupation}
                      />
                    </div>

                    <div>
                      <FieldLabel label="Educational Level" />
                      <select
                        className={selectClassName}
                        onChange={(event) =>
                          setEducationalLevel(event.target.value)
                        }
                        value={educationalLevel}
                      >
                        <option value="">Select educational level</option>
                        <option value="Primary School">Primary School</option>
                        <option value="Secondary School">Secondary School</option>
                        <option value="College">College</option>
                        <option value="University">University</option>
                        <option value="Graduate Studies">Graduate Studies</option>
                      </select>
                    </div>

                    <div>
                      <FieldLabel label="Marital Status" required />
                      <select
                        className={selectClassName}
                        onChange={(event) => setMaritalStatus(event.target.value)}
                        required
                        value={maritalStatus}
                      >
                        <option value="">Select marital status</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                      </select>
                    </div>

                    <div>
                      <FieldLabel label="Spouse Name" />
                      <input
                        className={cn(
                          fieldClassName,
                          !isSpouseFieldEnabled &&
                            "cursor-not-allowed border-[#ede8dc] bg-[#f6f3ed] text-[#a1a6b4]",
                        )}
                        disabled={!isSpouseFieldEnabled}
                        onChange={(event) => setSpouseName(event.target.value)}
                        placeholder={
                          isSpouseFieldEnabled
                            ? "Enter spouse name"
                            : "Available when married"
                        }
                        value={spouseName}
                      />
                    </div>

                    <div>
                      <FieldLabel
                        label="When I Joined to be a Spiritual Child"
                        required
                      />
                      <InputWithIcon
                        icon={<CalendarDays className="h-5 w-5" />}
                        onChange={(event) =>
                          setSpiritualChildJoinedDate(event.target.value)
                        }
                        placeholder="Select date"
                        required
                        type={spiritualChildJoinedDate ? "date" : "text"}
                        onFocus={(event) => {
                          event.currentTarget.type = "date";
                        }}
                        onBlur={(event) => {
                          if (!event.currentTarget.value) {
                            event.currentTarget.type = "text";
                          }
                        }}
                        value={spiritualChildJoinedDate}
                      />
                    </div>

                    <div>
                      <FieldLabel label="Children List" />
                      <Button
                        className="h-[54px] w-full rounded-[16px] border border-[#dfd6c4] bg-white text-[15px] font-bold text-[#324061] shadow-none hover:bg-[#faf6ee]"
                        onClick={addChildRow}
                        type="button"
                        variant="outline"
                      >
                        <Plus className="h-5 w-5 text-[#2f3d5d]" />
                        Add Child
                      </Button>
                    </div>
                  </div>

                  <div className="mt-6 overflow-hidden rounded-[20px] border border-[#e8e0d2] bg-white">
                    <div className="border-b border-[#efe7db] px-5 py-4">
                      <p className="text-[17px] font-bold text-[#1f2b52]">
                        Children
                      </p>
                    </div>

                    <div className="hidden grid-cols-[80px_1.5fr_1fr_1.2fr_100px] items-center gap-4 border-b border-[#efe7db] bg-[#fbf8f2] px-5 py-3 text-xs font-extrabold uppercase tracking-[0.08em] text-[#7d879d] md:grid">
                      <p>#</p>
                      <p>Child Name</p>
                      <p>Gender</p>
                      <p>Date of Birth</p>
                      <p className="text-right">Actions</p>
                    </div>

                    {children.length === 0 ? (
                      <div className="flex min-h-[190px] flex-col items-center justify-center px-6 py-10 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f7f2e7] text-[#8b96b0]">
                          <Users className="h-8 w-8" />
                        </div>

                        <p className="mt-4 text-[18px] font-semibold text-[#51607d]">
                          No children added yet.
                        </p>

                        <p className="mt-2 max-w-[320px] text-sm font-medium text-[#8c95a8]">
                          Click &quot;Add Child&quot; to include a child.
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y divide-[#f1eadf]">
                        {children.map((child, index) => (
                          <div
                            key={child.id}
                            className="grid gap-4 px-4 py-4 md:grid-cols-[80px_1.5fr_1fr_1.2fr_100px] md:items-center md:px-5"
                          >
                            <div className="text-sm font-extrabold text-[#3a4768]">
                              {index + 1}
                            </div>

                            <div>
                              <FieldLabel label="Child Name" />
                              <input
                                className={cn(fieldClassName, "md:h-12")}
                                onChange={(event) =>
                                  updateChildRow(
                                    child.id,
                                    "name",
                                    event.target.value,
                                  )
                                }
                                placeholder="Enter child name"
                                value={child.name}
                              />
                            </div>

                            <div>
                              <FieldLabel label="Gender" />
                              <select
                                className={cn(selectClassName, "md:h-12")}
                                onChange={(event) =>
                                  updateChildRow(
                                    child.id,
                                    "gender",
                                    event.target.value,
                                  )
                                }
                                value={child.gender}
                              >
                                <option value="">Select gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                              </select>
                            </div>

                            <div>
                              <FieldLabel label="Date of Birth" />
                              <input
                                className={cn(fieldClassName, "md:h-12")}
                                onChange={(event) =>
                                  updateChildRow(
                                    child.id,
                                    "dateOfBirth",
                                    event.target.value,
                                  )
                                }
                                type="date"
                                value={child.dateOfBirth}
                              />
                            </div>

                            <div className="flex items-end justify-end">
                              <button
                                aria-label={`Remove child ${index + 1}`}
                                className="flex h-12 w-12 items-center justify-center rounded-[14px] border border-[#eadfc9] bg-[#fffaf0] text-[#b46f5f] transition-colors hover:bg-[#fff1ea]"
                                onClick={() => removeChildRow(child.id)}
                                type="button"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </section>

                <section>
                  <h3 className={sectionTitleClassName}>
                    2. Emergency Contact
                  </h3>

                  <div className="mt-6 grid gap-5 lg:grid-cols-3">
                    <div>
                      <FieldLabel label="Contact Name" required />
                      <input
                        className={fieldClassName}
                        onChange={(event) =>
                          setEmergencyContactName(event.target.value)
                        }
                        placeholder="Enter contact name"
                        required
                        value={emergencyContactName}
                      />
                    </div>

                    <div>
                      <FieldLabel label="Relationship" required />
                      <select
                        className={selectClassName}
                        onChange={(event) =>
                          setEmergencyRelationship(event.target.value)
                        }
                        required
                        value={emergencyRelationship}
                      >
                        <option value="">Select relationship</option>
                        <option value="Parent">Parent</option>
                        <option value="Sibling">Sibling</option>
                        <option value="Spouse">Spouse</option>
                        <option value="Guardian">Guardian</option>
                        <option value="Relative">Relative</option>
                        <option value="Friend">Friend</option>
                      </select>
                    </div>

                    <div>
                      <FieldLabel label="Phone Number" required />
                      <InputWithIcon
                        icon={<Phone className="h-5 w-5" />}
                        onChange={handlePhoneChange(setEmergencyPhoneNumber)}
                        placeholder="0912 345 678"
                        required
                        type="tel"
                        value={emergencyPhoneNumber}
                      />
                    </div>
                  </div>
                </section>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-[#eee6d8] bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7 lg:px-10">
              <Button
                className="h-11 rounded-[14px] border border-[#dccfb8] bg-white px-5 text-[15px] font-bold text-[#344163] shadow-none hover:bg-[#faf6ef]"
                onClick={onClose}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>

              <Button className="h-11 rounded-[14px] bg-[#c39a37] px-6 text-[15px] font-bold text-white shadow-[0_10px_24px_rgba(195,154,55,0.24)] hover:bg-[#af892f]">
                <Save className="h-4 w-4" />
                Save Spiritual Child
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
