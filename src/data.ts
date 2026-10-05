export type Role = 'candidate' | 'employer' | 'admin';
export type Status = 'Submitted' | 'Under Review' | 'Shortlisted' | 'Interview' | 'Successful' | 'Unsuccessful';
export const statuses: Status[] = ['Submitted', 'Under Review', 'Shortlisted', 'Interview', 'Successful', 'Unsuccessful'];
export const categories = ['Mining', 'Engineering', 'Logistics', 'Administration', 'Hospitality', 'Agriculture'];
export const opportunityTypes = ['Full-time', 'Part-time', 'Contract', 'Learnership', 'Internship', 'Apprenticeship', 'Graduate programme', 'Training'];
export const locations = ['Carolina', 'Breyten', 'Ermelo', 'Hendrina'];

export interface Account { id: string; name: string; email: string; role: Role; passwordHash?: string; salt?: string; active: boolean }
export interface Candidate {
  id: string; name: string; email: string; phone: string; location: string;
  headline: string; skills: string[]; qualifications: string; experience: string;
  bio: string; verified: boolean; cv?: { name: string; data?: string; demo?: boolean }; saved: string[];
}
export interface Employer { id: string; name: string; initials: string; industry: string; location: string; email: string; phone: string; about: string; verified: boolean }
export interface Job {
  id: string; employerId: string; title: string; category: string; location: string;
  type: string; salary: string; description: string; requirements: string;
  skills: string[]; deadline: string; posted: string; open: boolean;
}
export interface Application { id: string; jobId: string; candidateId: string; status: Status; date: string; note: string; interview: string; interviewNotes: string; history: { status: Status; date: string }[] }
export interface Data { accounts: Account[]; candidates: Candidate[]; employers: Employer[]; jobs: Job[]; applications: Application[] }
export const uid = () => crypto.randomUUID();
export const today = () => new Date().toISOString().slice(0, 10);
export const isOpen = (job: Job) => job.open && job.deadline >= today();
export const dateLabel = (date: string) => date ? new Date(date.length === 10 ? date + 'T12:00:00' : date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Not scheduled';
export function completeness(candidate: Candidate) {
  return Math.round([candidate.name, candidate.phone, candidate.location, candidate.headline, candidate.skills.length, candidate.qualifications, candidate.experience, candidate.cv].filter(Boolean).length / 8 * 100);
}
function relativeDate(days: number) { const d = new Date(); d.setDate(d.getDate() + days); return d.toISOString().slice(0, 10); }

export function seed(): Data {
  const employers: Employer[] = [
    { id: 'e1', name: 'Carolina Mining Services', initials: 'CM', industry: 'Mining', location: 'Carolina', email: 'careers@carolinamining.example', phone: '017 555 0101', about: 'Supporting local mines with skilled maintenance teams and reliable engineering services. Investing in the talent of Carolina.', verified: true },
    { id: 'e2', name: 'Highveld Logistics', initials: 'HL', industry: 'Logistics', location: 'Ermelo', email: 'careers@highveld.example', phone: '017 555 0102', about: 'A regional transport partner connecting Mpumalanga businesses. Our people keep the Highveld moving.', verified: true },
    { id: 'e3', name: 'Nkomazi Engineering', initials: 'NE', industry: 'Engineering', location: 'Carolina', email: 'people@nkomazi.example', phone: '017 555 0103', about: 'Industrial electrical and mechanical engineering, with a focus on developing the next generation of artisans.', verified: true },
    { id: 'e4', name: 'Siyakhula Community Trust', initials: 'SC', industry: 'Administration', location: 'Breyten', email: 'jobs@siyakhula.example', phone: '017 555 0104', about: 'Community-led programmes that turn local potential into lasting opportunity.', verified: false },
    { id: 'e5', name: 'Mabena Agricultural Co-op', initials: 'MA', industry: 'Agriculture', location: 'Hendrina', email: 'work@mabena.example', phone: '017 555 0105', about: 'Growing sustainable agriculture and practical skills across our local farming communities.', verified: true },
  ];
  const candidates: Candidate[] = [
    { id: 'c1', name: 'Thandi M.', email: 'thandi@example.com', phone: '072 555 0101', location: 'Carolina', headline: 'Diesel mechanic · 5 years of experience', skills: ['Diesel Mechanic', 'Diagnostics', 'Maintenance', 'Safety'], qualifications: 'Diesel Mechanic Trade Test / N2 Mechanical Engineering', experience: '5 years · Diesel mechanic at a regional mining contractor. Engine diagnostics, preventive maintenance and workshop safety.', bio: 'A qualified mechanic with a passion for keeping local operations moving. Looking for an opportunity to grow with a team in Carolina.', verified: true, cv: { name: 'Thandi_M_CV.txt', demo: true }, saved: ['j4'] },
    { id: 'c2', name: 'Sipho Nkosi', email: 'sipho@example.com', phone: '073 555 0102', location: 'Ermelo', headline: 'Code 14 driver · PrDP certified', skills: ['Code 14 Driving', 'Logistics', 'Safety'], qualifications: 'Matric · Code 14 licence · Valid PrDP', experience: '4 years of regional freight delivery and vehicle inspections.', bio: 'Reliable driver with a strong safety record.', verified: true, cv: { name: 'Sipho_Nkosi_CV.txt', demo: true }, saved: [] },
    { id: 'c3', name: 'Nomsa Dlamini', email: 'nomsa@example.com', phone: '071 555 0103', location: 'Carolina', headline: 'Electrical engineering graduate', skills: ['Electrical', 'Maintenance', 'Safety'], qualifications: 'N6 Electrical Engineering', experience: '6 months · Work-integrated learning at a local workshop.', bio: 'Ready to put my engineering training into practice.', verified: false, cv: { name: 'Nomsa_Dlamini_CV.txt', demo: true }, saved: [] },
    { id: 'c4', name: 'Lerato Mokoena', email: 'lerato@example.com', phone: '082 555 0104', location: 'Breyten', headline: 'Office administrator', skills: ['Administration', 'Excel', 'Communication'], qualifications: 'Diploma in Office Management', experience: '2 years · Reception, data capture and community support.', bio: 'Organised, friendly and committed to supporting our community.', verified: true, cv: { name: 'Lerato_Mokoena_CV.txt', demo: true }, saved: [] },
    { id: 'c5', name: 'Bongani Mahlangu', email: 'bongani@example.com', phone: '084 555 0105', location: 'Hendrina', headline: 'Aspiring artisan', skills: ['Maintenance', 'Safety', 'Communication'], qualifications: 'Matric · N2 Mechanical Engineering', experience: '1 year · General maintenance assistant.', bio: 'Seeking a learnership to build practical artisan skills.', verified: false, saved: [] },
  ];
  const jobs: Job[] = [
    { id: 'j1', employerId: 'e1', title: 'Diesel Mechanic', category: 'Mining', location: 'Carolina', type: 'Full-time', salary: 'R22,000 – R30,000 / month', skills: ['Diesel Mechanic', 'Diagnostics', 'Maintenance'], description: 'Keep our mining fleet moving. Join a hands-on maintenance team servicing heavy-duty equipment in the Carolina area. You will diagnose faults, complete repairs and help maintain a safe, reliable operation.', requirements: 'Diesel Mechanic Trade Test\nN2 qualification or equivalent\n3+ years of heavy equipment experience\nCommitment to workplace safety', deadline: relativeDate(24), posted: relativeDate(-2), open: true },
    { id: 'j2', employerId: 'e2', title: 'Heavy Vehicle Driver', category: 'Logistics', location: 'Ermelo', type: 'Full-time', salary: 'R16,000 – R22,000 / month', skills: ['Code 14 Driving', 'Logistics', 'Safety'], description: 'Transport goods across the Highveld with a team that puts safety first. Perform daily vehicle checks and maintain accurate delivery records.', requirements: 'Code 14 licence\nValid PrDP\n2+ years of driving experience\nGood communication skills', deadline: relativeDate(18), posted: relativeDate(-3), open: true },
    { id: 'j3', employerId: 'e1', title: 'Maintenance Assistant', category: 'Mining', location: 'Carolina', type: 'Contract', salary: 'R8,500 – R11,000 / month', skills: ['Maintenance', 'Safety'], description: 'Support workshop artisans with routine inspections, basic repairs and equipment preparation. A practical role with room to learn.', requirements: 'Matric or N2\nBasic mechanical knowledge\nAbility to work shifts\nSafety-first approach', deadline: relativeDate(15), posted: relativeDate(-4), open: true },
    { id: 'j4', employerId: 'e3', title: 'Artisan Learnership', category: 'Engineering', location: 'Carolina', type: 'Learnership', salary: 'R4,500 monthly stipend', skills: ['Maintenance', 'Safety'], description: 'Start your artisan journey with a structured 12-month programme combining accredited learning and real workshop experience. Applications from local young people are encouraged.', requirements: 'Matric with Mathematics\nN2 Mechanical or Electrical advantageous\nAge 18–35\nAvailable for a 12-month programme', deadline: relativeDate(30), posted: relativeDate(-1), open: true },
    { id: 'j5', employerId: 'e3', title: 'Electrician – Industrial', category: 'Engineering', location: 'Carolina', type: 'Full-time', salary: 'R24,000 – R32,000 / month', skills: ['Electrical', 'Maintenance', 'Safety'], description: 'Install, maintain and troubleshoot industrial electrical systems. Work alongside experienced engineers on local projects.', requirements: 'Electrical Trade Test\nN3 Electrical Engineering\nIndustrial maintenance experience', deadline: relativeDate(20), posted: relativeDate(-5), open: true },
    { id: 'j6', employerId: 'e3', title: 'Engineering Graduate Programme', category: 'Engineering', location: 'Carolina', type: 'Graduate programme', salary: 'R12,000 monthly stipend', skills: ['Electrical', 'Communication'], description: 'An 18-month graduate programme with mentoring, site experience and a pathway to professional development.', requirements: 'Diploma or degree in Engineering\nRecent graduate\nWillingness to learn', deadline: relativeDate(35), posted: relativeDate(-7), open: true },
    { id: 'j7', employerId: 'e5', title: 'Agricultural Training Programme', category: 'Agriculture', location: 'Hendrina', type: 'Training', salary: 'Sponsored training', skills: ['Safety', 'Communication'], description: 'Learn sustainable farming practices, crop care and basic farm business skills in a community training programme.', requirements: 'Interest in agriculture\nAvailable for weekday training\nLocal residents encouraged', deadline: relativeDate(26), posted: relativeDate(-6), open: true },
    { id: 'j8', employerId: 'e2', title: 'Logistics Administration Intern', category: 'Administration', location: 'Ermelo', type: 'Internship', salary: 'R6,000 monthly stipend', skills: ['Administration', 'Excel', 'Communication'], description: 'Gain practical experience in dispatch administration, scheduling and customer communication.', requirements: 'Matric\nOffice Management or Logistics qualification\nBasic Excel skills', deadline: relativeDate(28), posted: relativeDate(-8), open: true },
    { id: 'j9', employerId: 'e5', title: 'Community Programme Assistant', category: 'Administration', location: 'Hendrina', type: 'Part-time', salary: 'R150 / hour', skills: ['Administration', 'Communication'], description: 'Help coordinate community workshops, attendance registers and participant communication three days a week.', requirements: 'Strong administration skills\nCommunity involvement\nGood written communication', deadline: relativeDate(19), posted: relativeDate(-9), open: true },
    { id: 'j10', employerId: 'e3', title: 'Electrical Apprenticeship', category: 'Engineering', location: 'Breyten', type: 'Apprenticeship', salary: 'R5,000 monthly stipend', skills: ['Electrical', 'Safety'], description: 'Develop electrical installation and maintenance skills through supervised practical experience and technical learning.', requirements: 'Matric with Mathematics and Physical Sciences\nN2 Electrical preferred\nA commitment to a 24-month programme', deadline: relativeDate(32), posted: relativeDate(-10), open: true },
  ];
  const apps: [string, string, Status][] = [['j1','c1','Submitted'],['j2','c1','Shortlisted'],['j3','c1','Under Review'],['j2','c2','Interview'],['j5','c3','Under Review'],['j6','c3','Submitted'],['j8','c4','Successful'],['j9','c4','Successful'],['j4','c5','Submitted'],['j3','c5','Unsuccessful']];
  return {
    accounts: [...candidates.map(c => ({ id: c.id, name: c.name, email: c.email, role: 'candidate' as const, active: true })), ...employers.map(e => ({ id: e.id, name: e.name, email: e.email, role: 'employer' as const, active: true })), { id: 'admin', name: 'CEBT Administrator', email: 'admin@cebt.example', role: 'admin', active: true }],
    candidates, employers, jobs,
    applications: apps.map(([jobId, candidateId, status], i) => ({ id: `a${i+1}`, jobId, candidateId, status, date: relativeDate(-12+i), note: 'I would welcome the opportunity to contribute my skills and grow with your team.', interview: status === 'Interview' ? relativeDate(5)+'T10:00' : '', interviewNotes: status === 'Interview' ? 'Bring your licence and qualification certificates. Meet at the Ermelo office.' : '', history: [{ status: 'Submitted', date: relativeDate(-12+i) }, ...(status !== 'Submitted' ? [{ status, date: relativeDate(-1) }] : [])] })),
  };
}

const STORAGE = 'cebt-portal-v1';
export function loadData(): Data {
  try { const saved = localStorage.getItem(STORAGE); if (saved) { const data = JSON.parse(saved); if (Array.isArray(data.accounts) && Array.isArray(data.jobs) && Array.isArray(data.candidates) && Array.isArray(data.employers) && Array.isArray(data.applications)) return data; } } catch { /* Start fresh if browser data is unavailable. */ }
  return seed();
}
export function persist(data: Data) { localStorage.setItem(STORAGE, JSON.stringify(data)); }
export async function hashPassword(password: string, salt: string) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const result = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: new TextEncoder().encode(salt), iterations: 100000, hash: 'SHA-256' }, key, 256);
  return Array.from(new Uint8Array(result)).map(b=>b.toString(16).padStart(2, '0')).join('');
}
