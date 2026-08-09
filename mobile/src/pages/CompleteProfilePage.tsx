import { ArrowLeft, Plus, Save, Trash2, Users } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import "./completeProfilePage.css";

type Values = Record<string, string | string[]>;
type Child = { id: number; name: string; gender: string; dateOfBirth: string };

const storageKey = "abune.mobile.profile-draft";
const options = {
  gender: [["MALE", "Male"], ["FEMALE", "Female"]],
  education: [["NON_FORMAL", "Non-formal Education"], ["PRIMARY", "Primary School"], ["SECONDARY", "Secondary School"], ["TVET_DIPLOMA", "TVET / Diploma"], ["BACHELOR", "Bachelor's Degree"], ["MASTER", "Master's Degree"], ["PHD", "PhD"]],
  spiritualEducation: [["BASIC_CHRISTIAN_EDUCATION_ONLY", "No formal spiritual education (basic Christian education only)"], ["FORMER_SUNDAY_SCHOOL_STUDENT", "Former Sunday School student"], ["CURRENT_SUNDAY_SCHOOL_STUDENT", "Current Sunday School student"], ["CHURCH_COURSES", "Completed short-term or long-term Bible study or church courses"], ["THEOLOGICAL_COLLEGE", "Theological College Education (Certificate / Diploma / Degree)"], ["ABINET_EDUCATION", "Completed Abinet (Traditional Church Education)"]],
  abinet: [["ZEMA", "Zema (Liturgical Chant)"], ["KIDASE", "Kidase (Divine Liturgy)"], ["QENE", "Qene (Ecclesiastical Poetry)"], ["SCRIPTURE_INTERPRETATION", "Interpretation of the Holy Scriptures"]],
  communion: [["EVERY_SUNDAY", "Every Sunday"], ["EVERY_MONTH", "Every Month"], ["SEVERAL_TIMES_A_YEAR", "Several times a year"], ["MAJOR_FEASTS_ONLY", "Major Feasts only"], ["RARELY", "Rarely"], ["NEVER", "Never"]],
  marital: [["SINGLE", "Single"], ["ORTHODOX_HOLY_MATRIMONY", "Married according to the Orthodox Church Sacrament"], ["CIVIL_OR_TRADITIONAL_MARRIAGE", "Married through Civil or Traditional Marriage"], ["DIVORCED", "Divorced"], ["WIDOWED", "Widowed"]],
  prayerBooks: [["WUDASE_MARYAM", "Wudase Maryam"], ["PSALMS", "Psalms"], ["BOOK_OF_HOURS", "Book of Hours (Se'atät)"], ["HOLY_BIBLE", "Holy Bible"], ["OTHER", "Other"]],
  yesNo: [["YES", "Yes"], ["NO", "No"]],
} as const;

function readDraft() {
  try {
    const draft = JSON.parse(window.localStorage.getItem(storageKey) ?? "{}");
    return { values: draft.values ?? draft, children: draft.children ?? [] } as { values: Values; children: Child[] };
  } catch { return { values: {}, children: [] }; }
}

export function CompleteProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [draft] = useState(readDraft);
  const [values, setValues] = useState<Values>(draft.values);
  const [children, setChildren] = useState<Child[]>(draft.children);
  const [saved, setSaved] = useState(false);
  const update = (name: string, value: string) => { setSaved(false); setValues((current) => ({ ...current, [name]: value })); };
  const toggle = (name: string, value: string) => { setSaved(false); setValues((current) => { const selected = Array.isArray(current[name]) ? current[name] : []; return { ...current, [name]: selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value] }; }); };
  const selected = (name: string, value: string) => Array.isArray(values[name]) && values[name].includes(value);
  const married = values.maritalStatus === "ORTHODOX_HOLY_MATRIMONY" || values.maritalStatus === "CIVIL_OR_TRADITIONAL_MARRIAGE";
  const prostrations = values.hasDailyProstrationRule === "YES";
  const submit = (event: FormEvent) => { event.preventDefault(); window.localStorage.setItem(storageKey, JSON.stringify({ values, children })); setSaved(true); };
  const addChild = () => setChildren((current) => [...current, { id: Date.now(), name: "", gender: "", dateOfBirth: "" }]);
  const updateChild = (id: number, name: keyof Omit<Child, "id">, value: string) => setChildren((current) => current.map((child) => child.id === id ? { ...child, [name]: value } : child));

  return <form className="complete-profile-page" onSubmit={submit}>
    <button aria-label="Back" className="complete-profile-back" onClick={() => navigate(location.state?.fromHome ? "/child" : "/child/more")} type="button"><ArrowLeft /></button>
    <div className="profile-heading"><div className="profile-cross">✝</div><div><h1>Add Spiritual Child</h1><p>Register a new spiritual child under your guidance.</p></div></div>
    <ProfileSection title="1. General & Educational Profile"><div className="profile-grid">
      <Field label="Baptismal (Christian) Name" name="baptismalName" placeholder="Enter baptismal name" required update={update} values={values} />
      <Field label="Legal / Given Name" name="legalName" placeholder="Enter legal / given name" required update={update} values={values} />
      <Field label="Gender" name="gender" options={options.gender} required update={update} values={values} />
      <Field label="Date of Birth" name="dateOfBirth" required type="date" update={update} values={values} />
      <Field label="Phone Number" name="phoneNumber" placeholder="0912 345 678" required type="tel" update={update} values={values} />
      <Field label="Address" name="address" placeholder="Enter address" required update={update} values={values} />
      <Field label="Current Occupation / Profession" name="occupation" placeholder="Enter occupation" required update={update} values={values} />
      <Field label="Educational Level" name="educationalLevel" options={options.education} required update={update} values={values} />
    </div></ProfileSection>
    <ProfileSection title="2. Spiritual Education Level"><CheckboxGroup label="Select all that apply" name="spiritualEducation" onToggle={toggle} options={options.spiritualEducation} required selected={selected} /><Field label="If you are or were a Sunday School student, for how many years?" name="sundaySchoolYears" placeholder="Enter number of years" update={update} values={values} /><CheckboxGroup boxed label="If you completed Abinet education, select the disciplines:" name="abinetDisciplines" onToggle={toggle} options={options.abinet} selected={selected} /></ProfileSection>
    <ProfileSection title="3. Church & Sacramental Standing"><div className="profile-grid">
      <Field label="Name of Previous Spiritual Father (Confessor)" name="previousSpiritualFather" placeholder="Enter spiritual father's name" required update={update} values={values} />
      <Field label="Reason for Changing Spiritual Father (if applicable)" multiline name="reasonForChangingSpiritualFather" placeholder="Enter your reason" update={update} values={values} />
      <RadioGroup label="Did you receive your previous Spiritual Father's blessing before transferring?" name="receivedPreviousFatherBlessing" options={options.yesNo} required update={update} values={values} />
      <div className="nested-fields"><Field label="Place of Holy Baptism" name="placeOfBaptism" placeholder="Enter place" required update={update} values={values} /><Field label="Date of Baptism" name="dateOfBaptism" required type="date" update={update} values={values} /></div>
      <Field label="How frequently do you receive Holy Communion?" name="holyCommunionFrequency" options={options.communion} required update={update} values={values} />
      <Field label="Marital Status" name="maritalStatus" options={options.marital} required update={update} values={values} />
    </div></ProfileSection>
    <ProfileSection title="4. Spiritual Discipline & Prayer Life"><div className="profile-grid">
      <Field label="How often do you pray each day?" name="prayerFrequency" placeholder="Enter, for example, 2 times or 3 times" required update={update} values={values} />
      <CheckboxGroup label="Which prayer books do you regularly use? (Select all that apply)" name="prayerBooks" onToggle={toggle} options={options.prayerBooks} required selected={selected} />
      {selected("prayerBooks", "OTHER") ? <Field label="Other prayer book" name="otherPrayerBook" placeholder="Please specify" update={update} values={values} /> : null}
      <Field label="Describe your fasting practice" multiline name="fastingPractice" placeholder="Enter your fasting practice" required update={update} values={values} />
      <RadioGroup label="Do you regularly read the Holy Bible, the Lives of the Saints, or other spiritual books?" name="readsSpiritualBooks" options={options.yesNo} required update={update} values={values} />
      <RadioGroup label="Do you have a daily rule for prostrations?" name="hasDailyProstrationRule" options={options.yesNo} required update={update} values={values} />
      <Field disabled={!prostrations} label="If yes, approximately how many prostrations per day?" name="dailyProstrationCount" placeholder="Enter a number, for example, 50 or 100" type="number" update={update} values={values} />
      <RadioGroup label="Do you faithfully give your tithe?" name="faithfullyGivesTithe" options={options.yesNo} required update={update} values={values} />
    </div></ProfileSection>
    <ProfileSection title="5. Family & Social History"><div className="profile-grid">
      <Field disabled={!married} label="Name of Spouse (Husband/Wife)" name="spouseName" placeholder={married ? "Enter spouse name" : "Available when married"} update={update} values={values} />
      <Field disabled={!married} label="Spiritual Father of Your Spouse (if different)" name="spouseSpiritualFather" placeholder={married ? "Enter name" : "Available when married"} update={update} values={values} />
      <Children children={children} onAdd={addChild} onRemove={(id) => setChildren((current) => current.filter((child) => child.id !== id))} onUpdate={updateChild} />
      <Field label="What is the greatest challenge within your family?" multiline name="greatestFamilyChallenge" placeholder="Describe the main challenge" required update={update} values={values} />
      <Field label="Health Status (Physical & Mental)" multiline name="healthStatus" placeholder="Enter relevant medical history or conditions" required update={update} values={values} />
    </div></ProfileSection>
    <ProfileSection title="6. Major Spiritual Struggles & Self-Examination"><div className="profile-grid">
      <Field label="Bodily Temptations / Addictions" multiline name="bodilyTemptations" placeholder="Describe any struggles, for example, alcohol or technology" required update={update} values={values} />
      <Field label="Spiritual & Emotional Struggles" multiline name="spiritualEmotionalStruggles" placeholder="Describe any struggles, for example, anger, pride, or anxiety" required update={update} values={values} />
      <Field label="Significant Future Life Decisions" multiline name="significantFutureDecisions" placeholder="Describe any major decisions you are considering" required update={update} values={values} />
    </div></ProfileSection>
    {saved ? <p className="profile-saved">Your spiritual child profile has been saved on this device.</p> : null}<button className="profile-save" type="submit"><Save /> Save Spiritual Child</button>
  </form>;
}

function ProfileSection({ title, children }: { title: string; children: ReactNode }) { return <section className="profile-section"><h2>{title}</h2>{children}</section>; }
function Field({ label, name, values, update, required, options: fieldOptions, multiline, type = "text", placeholder, disabled }: { label: string; name: string; values: Values; update: (name: string, value: string) => void; required?: boolean; options?: readonly (readonly [string, string])[]; multiline?: boolean; type?: string; placeholder?: string; disabled?: boolean }) { const value = typeof values[name] === "string" ? values[name] : ""; return <label className="profile-field"><span>{label}{required ? <i> *</i> : null}</span>{fieldOptions ? <select disabled={disabled} onChange={(event) => update(name, event.target.value)} required={required} value={value}><option value="">Select an option</option>{fieldOptions.map(([key, text]) => <option key={key} value={key}>{text}</option>)}</select> : multiline ? <textarea disabled={disabled} onChange={(event) => update(name, event.target.value)} placeholder={placeholder} required={required} value={value} /> : <input disabled={disabled} min={type === "number" ? "0" : undefined} onChange={(event) => update(name, event.target.value)} placeholder={placeholder} required={required} type={type} value={value} />}</label>; }
function CheckboxGroup({ label, name, options: groupOptions, selected, onToggle, required, boxed }: { label: string; name: string; options: readonly (readonly [string, string])[]; selected: (name: string, value: string) => boolean; onToggle: (name: string, value: string) => void; required?: boolean; boxed?: boolean }) { return <fieldset className={`choice-group${boxed ? " choice-box" : ""}`}><legend>{label}{required ? <i> *</i> : null}</legend>{groupOptions.map(([value, text]) => <label key={value}><input checked={selected(name, value)} onChange={() => onToggle(name, value)} type="checkbox" />{text}</label>)}</fieldset>; }
function RadioGroup({ label, name, values, update, options: groupOptions, required }: { label: string; name: string; values: Values; update: (name: string, value: string) => void; options: readonly (readonly [string, string])[]; required?: boolean }) { const value = typeof values[name] === "string" ? values[name] : ""; return <fieldset className="choice-group"><legend>{label}{required ? <i> *</i> : null}</legend><div className="radio-options">{groupOptions.map(([key, text]) => <label key={key}><input checked={value === key} name={name} onChange={() => update(name, key)} required={required} type="radio" value={key} />{text}</label>)}</div></fieldset>; }
function Children({ children, onAdd, onRemove, onUpdate }: { children: Child[]; onAdd: () => void; onRemove: (id: number) => void; onUpdate: (id: number, name: keyof Omit<Child, "id">, value: string) => void }) { return <section className="children-section"><header><b>Children</b><button onClick={onAdd} type="button"><Plus /> Add Child</button></header>{children.length === 0 ? <p className="children-empty"><Users />No children added yet.<small>Click “Add Child” to include a child.</small></p> : children.map((child, index) => <div className="child-row" key={child.id}><b>{index + 1}</b><input aria-label="Child Name" onChange={(event) => onUpdate(child.id, "name", event.target.value)} placeholder="Enter child name" value={child.name} /><select aria-label="Child gender" onChange={(event) => onUpdate(child.id, "gender", event.target.value)} value={child.gender}><option value="">Select gender</option>{options.gender.map(([key, text]) => <option key={key} value={key}>{text}</option>)}</select><input aria-label="Child date of birth" onChange={(event) => onUpdate(child.id, "dateOfBirth", event.target.value)} type="date" value={child.dateOfBirth} /><button aria-label={`Remove child ${index + 1}`} onClick={() => onRemove(child.id)} type="button"><Trash2 /></button></div>)}</section>; }
