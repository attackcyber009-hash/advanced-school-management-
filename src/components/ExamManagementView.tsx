import { useState } from 'react';
import {
  GraduationCap,
  Award,
  FileSpreadsheet,
  Printer,
  Medal,
  Search,
  Filter,
  CheckCircle2,
  TrendingUp,
  Calendar,
  Clock,
  UserCheck,
  Building,
  FileText,
  AlertCircle,
  BarChart3,
  Plus,
  Download,
  ShieldCheck,
  Sparkles,
  QrCode,
} from 'lucide-react';
import { StudentMarkEntry, ExamDatesheetItem } from '../types';
import { INITIAL_DATESHEET } from '../data/phase6Data';

interface ExamManagementViewProps {
  marks: StudentMarkEntry[];
  onPrintReportCard: (entry: StudentMarkEntry) => void;
  onPrintAdmitCard: (entry: StudentMarkEntry) => void;
  onUpdateMarks: (id: string, obtained: number) => void;
}

export default function ExamManagementView({
  marks,
  onPrintReportCard,
  onPrintAdmitCard,
  onUpdateMarks,
}: ExamManagementViewProps) {
  const [activeTab, setActiveTab] = useState<
    'marks' | 'tabulation' | 'datesheet' | 'admit_cards' | 'positions' | 'report_cards'
  >('marks');
  const [selectedExam, setSelectedExam] = useState('Mid-Term Assessment 2024');
  const [selectedClass, setSelectedClass] = useState('Class One');
  const [selectedSection, setSelectedSection] = useState('A');
  const [searchQuery, setSearchQuery] = useState('');

  // Datesheet state
  const [datesheet, setDatesheet] = useState<ExamDatesheetItem[]>(INITIAL_DATESHEET);
  const [newPaperModal, setNewPaperModal] = useState(false);
  const [paperForm, setPaperForm] = useState<Partial<ExamDatesheetItem>>({
    examTerm: 'Mid-Term Assessment 2024',
    className: 'Class One',
    subject: 'Social Studies',
    paperDate: '2024-10-25',
    dayOfWeek: 'Friday',
    startTime: '08:30 AM',
    endTime: '11:00 AM',
    totalMarks: 100,
    passingMarks: 40,
    roomNo: 'Hall-A (Room 101)',
    invigilatorName: 'Ms. Hina Qureshi',
    instructions: 'Bring geometry kit and colored pencils.',
  });

  // Selected Admit Card Preview
  const [admitCardStudent, setAdmitCardStudent] = useState<StudentMarkEntry | null>(null);

  // Selected Report Card Preview
  const [selectedReportCard, setSelectedReportCard] = useState<StudentMarkEntry | null>(null);

  // Filter marks
  const filteredMarks = marks.filter((m) => {
    const matchClass = m.className === selectedClass;
    const matchSearch =
      m.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.rollNo.includes(searchQuery);
    return matchClass && matchSearch;
  });

  // Sort by total obtained marks to find positions
  const rankedStudents = [...filteredMarks].sort((a, b) => b.totalObtained - a.totalObtained);

  const calculateGrade = (pct: number) => {
    if (pct >= 85) return 'A+';
    if (pct >= 75) return 'A';
    if (pct >= 65) return 'B';
    if (pct >= 55) return 'C';
    if (pct >= 40) return 'D';
    return 'F';
  };

  const handleAddPaper = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paperForm.subject || !paperForm.paperDate) return;
    const item: ExamDatesheetItem = {
      id: `ds-${Date.now()}`,
      examTerm: selectedExam,
      className: selectedClass,
      subject: paperForm.subject || 'General Subject',
      paperDate: paperForm.paperDate || '2024-10-25',
      dayOfWeek: paperForm.dayOfWeek || 'Monday',
      startTime: paperForm.startTime || '08:30 AM',
      endTime: paperForm.endTime || '11:00 AM',
      totalMarks: Number(paperForm.totalMarks) || 100,
      passingMarks: Number(paperForm.passingMarks) || 40,
      roomNo: paperForm.roomNo || 'Hall-A',
      invigilatorName: paperForm.invigilatorName || 'Senior Teacher',
      instructions: paperForm.instructions || 'Standard examination conduct rules apply.',
    };
    setDatesheet((prev) => [...prev, item]);
    setNewPaperModal(false);
  };

  return (
    <div id="exam-management-suite" className="space-y-4">
      {/* Top Banner & Module Header */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-900 text-amber-300 flex items-center justify-center font-bold shadow">
            <GraduationCap className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-800">
                Examinations, Tabulation &amp; Grading Suite
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                BISE Standard
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Exam datesheets, admit cards, subject mark entry, tabulation broadsheets &amp; progress report cards
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded border border-slate-300 flex items-center gap-1.5 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print View</span>
          </button>
          <button
            type="button"
            onClick={() => {
              if (rankedStudents[0]) {
                onPrintReportCard(rankedStudents[0]);
              } else {
                alert('No student marks available to print.');
              }
            }}
            className="px-3.5 py-1.5 bg-indigo-800 hover:bg-indigo-900 text-white text-xs font-bold rounded flex items-center gap-1.5 shadow transition"
          >
            <Printer className="w-3.5 h-3.5 text-amber-300" />
            <span>Batch Print Result Cards</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-white rounded-lg border border-slate-200 p-1.5 shadow-xs flex flex-wrap items-center gap-1 text-xs font-medium">
        <button
          type="button"
          onClick={() => setActiveTab('marks')}
          className={`px-3.5 py-2 rounded-md transition flex items-center gap-1.5 ${
            activeTab === 'marks'
              ? 'bg-[#1b3b6f] text-white font-bold shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Subject Marks Sheet</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('tabulation')}
          className={`px-3.5 py-2 rounded-md transition flex items-center gap-1.5 ${
            activeTab === 'tabulation'
              ? 'bg-[#1b3b6f] text-white font-bold shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span>Master Tabulation Broadsheet</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('datesheet')}
          className={`px-3.5 py-2 rounded-md transition flex items-center gap-1.5 ${
            activeTab === 'datesheet'
              ? 'bg-[#1b3b6f] text-white font-bold shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4 text-sky-400" />
          <span>Exam Datesheet &amp; Rooms</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('admit_cards')}
          className={`px-3.5 py-2 rounded-md transition flex items-center gap-1.5 ${
            activeTab === 'admit_cards'
              ? 'bg-[#1b3b6f] text-white font-bold shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-teal-400" />
          <span>Admit Cards &amp; Roll No Slips</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('positions')}
          className={`px-3.5 py-2 rounded-md transition flex items-center gap-1.5 ${
            activeTab === 'positions'
              ? 'bg-amber-600 text-white font-bold shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4 text-amber-300" />
          <span>Position Holders &amp; Honor Roll</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('report_cards')}
          className={`px-3.5 py-2 rounded-md transition flex items-center gap-1.5 ${
            activeTab === 'report_cards'
              ? 'bg-[#1b3b6f] text-white font-bold shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-4 h-4 text-yellow-300" />
          <span>Official Progress Report Card</span>
        </button>
      </div>

      {/* Filter Ribbon */}
      <div className="bg-white rounded-lg border border-slate-200 p-3 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
              Examination Term
            </label>
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 rounded bg-white font-semibold text-slate-800"
            >
              <option value="Mid-Term Assessment 2024">Mid-Term Assessment 2024</option>
              <option value="Final Term Annual 2024">Final Term Annual 2024</option>
              <option value="First Term 2024">First Term 2024</option>
              <option value="Monthly Test Sept 2024">Monthly Test September 2024</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
              Class Wing
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 rounded bg-white font-semibold text-slate-800"
            >
              <option value="Class One">Class One</option>
              <option value="Class Two">Class Two</option>
              <option value="Class Three">Class Three</option>
              <option value="Class Four">Class Four</option>
              <option value="Class Five">Class Five</option>
              <option value="Matric Part 1 (9th)">Matric Part 1 (9th)</option>
              <option value="Matric Part 2 (10th)">Matric Part 2 (10th)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
              Section
            </label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 rounded bg-white font-semibold text-slate-800"
            >
              <option value="A">Section A (Boys/Girls)</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
              Search Student
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              <input
                type="text"
                placeholder="Roll # or Student Name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 border border-slate-300 rounded bg-white w-48 text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Quick KPI stats pill */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
          <div className="text-right">
            <div className="text-[10px] text-slate-500">Students Evaluated</div>
            <div className="text-xs font-bold text-slate-800 font-mono">
              {filteredMarks.length} Enrolled
            </div>
          </div>
          <div className="w-px h-6 bg-slate-200" />
          <div className="text-right">
            <div className="text-[10px] text-slate-500">Class Average</div>
            <div className="text-xs font-bold text-emerald-700 font-mono">
              {filteredMarks.length
                ? Math.round(
                    filteredMarks.reduce((acc, m) => acc + m.percentage, 0) /
                      filteredMarks.length
                  )
                : 0}
              %
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* TAB 1: SUBJECT MARKS SHEET & EXCEL-LIKE QUICK ENTRY */}
      {/* ============================================================ */}
      {activeTab === 'marks' && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden text-xs">
          <div className="p-3 bg-slate-50 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-indigo-700" />
              <span className="font-bold text-slate-800">
                Subject Marks Award List — {selectedClass} ({selectedExam})
              </span>
            </div>
            <div className="text-[11px] text-slate-500">
              Double-click or edit values to update marks. Total &amp; Grade update automatically.
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b">
                <tr>
                  <th className="py-2.5 px-3">Roll #</th>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3 text-center">English (100)</th>
                  <th className="py-2.5 px-3 text-center">Urdu (100)</th>
                  <th className="py-2.5 px-3 text-center">Math (100)</th>
                  <th className="py-2.5 px-3 text-center">Science (100)</th>
                  <th className="py-2.5 px-3 text-center">Total (400)</th>
                  <th className="py-2.5 px-3 text-center">%</th>
                  <th className="py-2.5 px-3 text-center">Grade</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMarks.map((entry) => {
                  const eng = entry.subjectMarks.find((s) => s.subject === 'English')?.obtainedMarks || 0;
                  const urdu = entry.subjectMarks.find((s) => s.subject === 'Urdu')?.obtainedMarks || 0;
                  const math = entry.subjectMarks.find((s) => s.subject === 'Mathematics')?.obtainedMarks || 0;
                  const sci = entry.subjectMarks.find((s) => s.subject === 'General Science')?.obtainedMarks || 0;
                  const pct = entry.percentage;
                  const isPass = pct >= 40;

                  return (
                    <tr key={entry.id} className="hover:bg-sky-50/50 transition">
                      <td className="py-2.5 px-3 font-mono font-bold text-sky-800">{entry.rollNo}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-800">
                        {entry.studentName}
                        <div className="text-[10px] text-slate-400 font-normal">Section {entry.section}</div>
                      </td>

                      {/* Marks inputs */}
                      <td className="py-2.5 px-3 text-center">
                        <input
                          type="number"
                          defaultValue={eng}
                          min={0}
                          max={100}
                          onBlur={(e) => {
                            const val = Number(e.target.value);
                            const updated = val + urdu + math + sci;
                            onUpdateMarks(entry.id, updated);
                          }}
                          className="w-14 text-center py-1 border border-slate-200 rounded font-mono font-semibold focus:border-indigo-500 focus:bg-white bg-slate-50"
                        />
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <input
                          type="number"
                          defaultValue={urdu}
                          min={0}
                          max={100}
                          onBlur={(e) => {
                            const val = Number(e.target.value);
                            const updated = eng + val + math + sci;
                            onUpdateMarks(entry.id, updated);
                          }}
                          className="w-14 text-center py-1 border border-slate-200 rounded font-mono font-semibold focus:border-indigo-500 focus:bg-white bg-slate-50"
                        />
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <input
                          type="number"
                          defaultValue={math}
                          min={0}
                          max={100}
                          onBlur={(e) => {
                            const val = Number(e.target.value);
                            const updated = eng + urdu + val + sci;
                            onUpdateMarks(entry.id, updated);
                          }}
                          className="w-14 text-center py-1 border border-slate-200 rounded font-mono font-semibold focus:border-indigo-500 focus:bg-white bg-slate-50"
                        />
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <input
                          type="number"
                          defaultValue={sci}
                          min={0}
                          max={100}
                          onBlur={(e) => {
                            const val = Number(e.target.value);
                            const updated = eng + urdu + math + val;
                            onUpdateMarks(entry.id, updated);
                          }}
                          className="w-14 text-center py-1 border border-slate-200 rounded font-mono font-semibold focus:border-indigo-500 focus:bg-white bg-slate-50"
                        />
                      </td>

                      <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-900">
                        {entry.totalObtained}
                        <span className="text-[10px] text-slate-400">/{entry.totalMax}</span>
                      </td>

                      <td className="py-2.5 px-3 text-center font-mono font-bold">
                        {entry.percentage}%
                      </td>

                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                            entry.overallGrade.includes('A')
                              ? 'bg-emerald-100 text-emerald-800'
                              : entry.overallGrade === 'B'
                              ? 'bg-sky-100 text-sky-800'
                              : entry.overallGrade === 'C'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {entry.overallGrade}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 text-center">
                        {isPass ? (
                          <span className="text-emerald-700 font-bold flex items-center justify-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Passed</span>
                          </span>
                        ) : (
                          <span className="text-rose-700 font-bold flex items-center justify-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>Supply</span>
                          </span>
                        )}
                      </td>

                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedReportCard(entry)}
                            className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded font-medium text-[11px] flex items-center gap-1 border border-indigo-200"
                            title="Preview Report Card"
                          >
                            <FileText className="w-3 h-3" />
                            <span>Preview</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onPrintReportCard(entry)}
                            className="px-2 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-bold text-[11px] flex items-center gap-1 shadow-xs"
                            title="Print Card"
                          >
                            <Printer className="w-3 h-3" />
                            <span>Print</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: MASTER TABULATION SHEET (CONSOLIDATED BROAD SHEET) */}
      {/* ============================================================ */}
      {activeTab === 'tabulation' && (
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-4 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
            <div>
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-700" />
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                  Master Tabulation Broadsheet &amp; Gazette
                </h3>
              </div>
              <p className="text-slate-500 text-[11px] mt-0.5">
                The Educators Campus • {selectedClass} • Session 2024-2025 • {selectedExam}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  alert('Exporting official Tabulation Sheet to Excel / CSV format...');
                }}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-bold flex items-center gap-1 border border-slate-300"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-black text-white rounded font-bold flex items-center gap-1.5 shadow"
              >
                <Printer className="w-3.5 h-3.5 text-amber-300" />
                <span>Print Official Broadsheet</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-300 rounded">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                <tr>
                  <th className="p-2 border-r border-slate-300 text-center w-12">Pos.</th>
                  <th className="p-2 border-r border-slate-300 text-center w-14">Roll #</th>
                  <th className="p-2 border-r border-slate-300">Candidate Full Name</th>
                  <th className="p-2 border-r border-slate-300 text-center">English (100)</th>
                  <th className="p-2 border-r border-slate-300 text-center">Urdu (100)</th>
                  <th className="p-2 border-r border-slate-300 text-center">Math (100)</th>
                  <th className="p-2 border-r border-slate-300 text-center">Science (100)</th>
                  <th className="p-2 border-r border-slate-300 text-center">Grand Total (400)</th>
                  <th className="p-2 border-r border-slate-300 text-center">%</th>
                  <th className="p-2 border-r border-slate-300 text-center">Grade</th>
                  <th className="p-2 text-center">Board Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                {rankedStudents.map((m, idx) => {
                  const eng = m.subjectMarks.find((s) => s.subject === 'English')?.obtainedMarks || 88;
                  const urdu = m.subjectMarks.find((s) => s.subject === 'Urdu')?.obtainedMarks || 90;
                  const math = m.subjectMarks.find((s) => s.subject === 'Mathematics')?.obtainedMarks || 92;
                  const sci = m.subjectMarks.find((s) => s.subject === 'General Science')?.obtainedMarks || 95;
                  const isTop3 = idx < 3;

                  return (
                    <tr key={m.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="p-2 border-r border-slate-300 text-center font-bold">
                        {isTop3 ? (
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] text-white font-black ${
                              idx === 0 ? 'bg-amber-500' : idx === 1 ? 'bg-slate-500' : 'bg-orange-600'
                            }`}
                          >
                            {idx + 1}
                            {idx === 0 ? 'st' : idx === 1 ? 'nd' : 'rd'}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-normal">{idx + 1}</span>
                        )}
                      </td>
                      <td className="p-2 border-r border-slate-300 text-center font-bold text-sky-800">
                        {m.rollNo}
                      </td>
                      <td className="p-2 border-r border-slate-300 font-sans font-bold text-slate-800">
                        {m.studentName}
                      </td>
                      <td className="p-2 border-r border-slate-300 text-center">{eng}</td>
                      <td className="p-2 border-r border-slate-300 text-center">{urdu}</td>
                      <td className="p-2 border-r border-slate-300 text-center">{math}</td>
                      <td className="p-2 border-r border-slate-300 text-center">{sci}</td>
                      <td className="p-2 border-r border-slate-300 text-center font-bold text-emerald-900 bg-emerald-50/50">
                        {m.totalObtained} / {m.totalMax}
                      </td>
                      <td className="p-2 border-r border-slate-300 text-center font-bold">
                        {m.percentage}%
                      </td>
                      <td className="p-2 border-r border-slate-300 text-center font-sans font-bold text-indigo-900">
                        {m.overallGrade}
                      </td>
                      <td className="p-2 text-center font-sans">
                        <span className="text-emerald-700 font-bold text-[11px] uppercase tracking-wider">
                          PASSED
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Broad Sheet Summary Footnotes */}
          <div className="pt-3 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-600 text-[11px]">
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <div className="text-slate-500">Total Candidates Appeared</div>
              <div className="text-sm font-bold text-slate-800">{rankedStudents.length} Students</div>
            </div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <div className="text-slate-500">Overall Pass Rate</div>
              <div className="text-sm font-bold text-emerald-700">100% Passed</div>
            </div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <div className="text-slate-500">Class Highest Marks</div>
              <div className="text-sm font-bold text-amber-700">
                {rankedStudents[0]?.totalObtained || 0} / 400
              </div>
            </div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <div className="text-slate-500">Controller of Examinations</div>
              <div className="text-sm font-bold text-slate-800">Verified &amp; Sealed</div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 3: DATESHEET & TIMETABLE SCHEDULER */}
      {/* ============================================================ */}
      {activeTab === 'datesheet' && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Official Examination Datesheet &amp; Hall Allotment
              </h3>
              <p className="text-slate-500 text-xs">
                Term: {selectedExam} • Wing: {selectedClass} • Morning Shift (08:30 AM - 11:00 AM)
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setNewPaperModal(true)}
                className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-bold text-xs flex items-center gap-1.5 shadow"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Exam Paper</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-3.5 py-1.5 bg-[#1b3b6f] hover:bg-[#122847] text-white rounded font-bold text-xs flex items-center gap-1.5 shadow"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Datesheet</span>
              </button>
            </div>
          </div>

          {/* Datesheet Schedule Table */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#102a4e] text-white font-bold">
                <tr>
                  <th className="py-2.5 px-3 text-center w-12">#</th>
                  <th className="py-2.5 px-3">Date &amp; Day</th>
                  <th className="py-2.5 px-3">Subject</th>
                  <th className="py-2.5 px-3 text-center">Timing Slot</th>
                  <th className="py-2.5 px-3 text-center">Total Marks</th>
                  <th className="py-2.5 px-3">Exam Hall / Room</th>
                  <th className="py-2.5 px-3">Invigilator Staff</th>
                  <th className="py-2.5 px-3">Syllabus Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {datesheet.map((paper, i) => (
                  <tr key={paper.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3 text-center font-bold text-slate-400 font-mono">
                      {i + 1}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{paper.paperDate}</div>
                      <div className="text-[11px] text-indigo-700 font-semibold">{paper.dayOfWeek}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-extrabold text-slate-800 text-sm">{paper.subject}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{paper.className}</div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-1 rounded bg-slate-100 text-slate-800 font-mono text-[11px] font-bold inline-flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {paper.startTime} - {paper.endTime}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-slate-800">
                      {paper.totalMarks}
                      <span className="text-[10px] text-slate-400 block font-normal">
                        Pass: {paper.passingMarks}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-slate-700 flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        {paper.roomNo}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-medium text-emerald-800 flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                        {paper.invigilatorName}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500 text-[11px] max-w-xs">
                      {paper.instructions}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* New Paper Modal */}
          {newPaperModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-5 border border-slate-300 space-y-4 text-xs">
                <div className="flex items-center justify-between border-b pb-2">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    <span>Schedule Exam Paper</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setNewPaperModal(false)}
                    className="text-slate-400 hover:text-slate-600 text-sm font-bold"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleAddPaper} className="space-y-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Subject Name</label>
                    <input
                      type="text"
                      required
                      value={paperForm.subject}
                      onChange={(e) => setPaperForm({ ...paperForm, subject: e.target.value })}
                      placeholder="e.g. Computer Science / Social Studies"
                      className="w-full px-3 py-1.5 border rounded"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Exam Date</label>
                      <input
                        type="date"
                        required
                        value={paperForm.paperDate}
                        onChange={(e) => setPaperForm({ ...paperForm, paperDate: e.target.value })}
                        className="w-full px-3 py-1.5 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Day of Week</label>
                      <select
                        value={paperForm.dayOfWeek}
                        onChange={(e) => setPaperForm({ ...paperForm, dayOfWeek: e.target.value })}
                        className="w-full px-3 py-1.5 border rounded bg-white"
                      >
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Start Time</label>
                      <input
                        type="text"
                        value={paperForm.startTime}
                        onChange={(e) => setPaperForm({ ...paperForm, startTime: e.target.value })}
                        className="w-full px-3 py-1.5 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">End Time</label>
                      <input
                        type="text"
                        value={paperForm.endTime}
                        onChange={(e) => setPaperForm({ ...paperForm, endTime: e.target.value })}
                        className="w-full px-3 py-1.5 border rounded"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Room / Hall</label>
                      <input
                        type="text"
                        value={paperForm.roomNo}
                        onChange={(e) => setPaperForm({ ...paperForm, roomNo: e.target.value })}
                        className="w-full px-3 py-1.5 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Invigilator</label>
                      <input
                        type="text"
                        value={paperForm.invigilatorName}
                        onChange={(e) => setPaperForm({ ...paperForm, invigilatorName: e.target.value })}
                        className="w-full px-3 py-1.5 border rounded"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t">
                    <button
                      type="button"
                      onClick={() => setNewPaperModal(false)}
                      className="px-3 py-1.5 border rounded text-slate-600 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-bold"
                    >
                      Save Paper
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 4: ADMIT CARDS & ROLL NUMBER SLIPS */}
      {/* ============================================================ */}
      {activeTab === 'admit_cards' && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Examination Roll Number Slips &amp; Candidate Admit Cards
              </h3>
              <p className="text-slate-500 text-xs">
                Candidate examination entry pass with financial clearance seal &amp; barcode
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (filteredMarks[0]) onPrintAdmitCard(filteredMarks[0]);
              }}
              className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold rounded flex items-center gap-1.5 shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print All Class Admit Cards</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredMarks.map((student) => (
              <div
                key={student.id}
                className="bg-white rounded-xl border-2 border-slate-300 p-4 shadow-sm hover:shadow transition relative overflow-hidden text-xs space-y-3"
              >
                {/* School Header Banner */}
                <div className="border-b-2 border-slate-900 pb-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center font-black text-xs">
                      TE
                    </div>
                    <div>
                      <div className="font-extrabold text-slate-900 text-xs uppercase tracking-wide">
                        THE EDUCATORS
                      </div>
                      <div className="text-[10px] text-slate-500">Official Examination Admit Slip 2024</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                      DUES CLEARED
                    </span>
                  </div>
                </div>

                {/* Candidate Info Grid */}
                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded border border-slate-200">
                  <div className="col-span-2 space-y-1">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Candidate Name</span>
                      <span className="font-bold text-slate-900 text-sm">{student.studentName}</span>
                    </div>
                    <div className="flex items-center gap-4 text-[11px]">
                      <div>
                        <span className="text-[10px] text-slate-400">Class: </span>
                        <span className="font-semibold text-slate-800">{student.className}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400">Section: </span>
                        <span className="font-semibold text-slate-800">{student.section}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <span className="text-[10px] text-slate-400 block">Roll Number</span>
                    <span className="font-black text-lg text-sky-800 font-mono block">
                      {student.rollNo}
                    </span>
                    <span className="text-[9px] font-mono text-slate-500">Center: Hall-A</span>
                  </div>
                </div>

                {/* Datesheet Preview Table */}
                <div className="border rounded overflow-hidden">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-slate-100 text-slate-700 font-semibold">
                      <tr>
                        <th className="py-1 px-2">Date</th>
                        <th className="py-1 px-2">Subject</th>
                        <th className="py-1 px-2 text-right">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {datesheet.slice(0, 3).map((d) => (
                        <tr key={d.id}>
                          <td className="py-1 px-2 font-mono text-slate-600">{d.paperDate}</td>
                          <td className="py-1 px-2 font-bold text-slate-800">{d.subject}</td>
                          <td className="py-1 px-2 text-right font-mono text-slate-600">{d.startTime}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Instructions & Barcode Footer */}
                <div className="pt-2 border-t flex items-center justify-between text-[10px] text-slate-500">
                  <div className="flex items-center gap-1.5 font-mono">
                    <QrCode className="w-4 h-4 text-slate-700" />
                    <span>SLIP-2024-{student.rollNo}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onPrintAdmitCard(student)}
                      className="px-2.5 py-1 bg-indigo-700 hover:bg-indigo-800 text-white rounded font-bold text-[11px] flex items-center gap-1 shadow-xs"
                    >
                      <Printer className="w-3 h-3" />
                      <span>Print Slip</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 5: POSITION HOLDERS & MERIT ACCLAIM */}
      {/* ============================================================ */}
      {activeTab === 'positions' && (
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs space-y-6 text-xs">
          <div className="text-center space-y-1">
            <h3 className="text-base font-bold text-slate-800 flex items-center justify-center gap-2">
              <Award className="w-6 h-6 text-amber-500" />
              <span>Academic Distinction &amp; Position Holders — {selectedClass}</span>
            </h3>
            <p className="text-slate-500 text-xs">
              Honorees of {selectedExam} • Certified by Academic Council &amp; Controller of Examinations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
            {/* 1st Position */}
            {rankedStudents[0] && (
              <div className="p-5 bg-gradient-to-b from-amber-50 to-amber-100/70 rounded-2xl border-2 border-amber-400 text-center space-y-3 relative overflow-hidden shadow-md">
                <div className="absolute -top-3 -right-3 w-14 h-14 bg-amber-400 text-amber-900 rounded-full flex items-end justify-center pb-2 font-black text-xs shadow">
                  1st
                </div>
                <div className="w-16 h-16 mx-auto rounded-full bg-amber-400 text-amber-900 flex items-center justify-center shadow-lg border-2 border-amber-200">
                  <Medal className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-black text-base text-slate-900">{rankedStudents[0].studentName}</h4>
                  <div className="text-amber-800 font-mono text-[11px] font-bold">
                    Roll No. {rankedStudents[0].rollNo} • Sec {rankedStudents[0].section}
                  </div>
                </div>
                <div className="bg-white/90 p-3 rounded-xl border border-amber-300 font-mono space-y-1">
                  <div className="text-xs text-slate-500">Marks Secured</div>
                  <div className="text-xl font-black text-amber-900">
                    {rankedStudents[0].totalObtained} / {rankedStudents[0].totalMax}
                  </div>
                  <div className="text-xs font-bold text-emerald-700">
                    {rankedStudents[0].percentage}% (Grade A+ Distinction)
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onPrintReportCard(rankedStudents[0])}
                  className="w-full py-1.5 bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold rounded-lg text-xs shadow transition"
                >
                  Print Distinction Award
                </button>
              </div>
            )}

            {/* 2nd Position */}
            {rankedStudents[1] && (
              <div className="p-5 bg-gradient-to-b from-slate-50 to-slate-100 rounded-2xl border-2 border-slate-300 text-center space-y-3 relative overflow-hidden shadow-md">
                <div className="absolute -top-3 -right-3 w-14 h-14 bg-slate-300 text-slate-800 rounded-full flex items-end justify-center pb-2 font-black text-xs shadow">
                  2nd
                </div>
                <div className="w-16 h-16 mx-auto rounded-full bg-slate-300 text-slate-700 flex items-center justify-center shadow-lg border-2 border-slate-200">
                  <Medal className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-black text-base text-slate-900">{rankedStudents[1].studentName}</h4>
                  <div className="text-slate-700 font-mono text-[11px] font-bold">
                    Roll No. {rankedStudents[1].rollNo} • Sec {rankedStudents[1].section}
                  </div>
                </div>
                <div className="bg-white/90 p-3 rounded-xl border border-slate-200 font-mono space-y-1">
                  <div className="text-xs text-slate-500">Marks Secured</div>
                  <div className="text-xl font-black text-slate-800">
                    {rankedStudents[1].totalObtained} / {rankedStudents[1].totalMax}
                  </div>
                  <div className="text-xs font-bold text-emerald-700">
                    {rankedStudents[1].percentage}% (Grade A+ Runner-up)
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onPrintReportCard(rankedStudents[1])}
                  className="w-full py-1.5 bg-slate-700 hover:bg-slate-800 text-white font-bold rounded-lg text-xs shadow transition"
                >
                  Print Merit Award
                </button>
              </div>
            )}

            {/* 3rd Position */}
            {rankedStudents[2] && (
              <div className="p-5 bg-gradient-to-b from-orange-50 to-amber-50 rounded-2xl border-2 border-orange-300 text-center space-y-3 relative overflow-hidden shadow-md">
                <div className="absolute -top-3 -right-3 w-14 h-14 bg-orange-400 text-orange-950 rounded-full flex items-end justify-center pb-2 font-black text-xs shadow">
                  3rd
                </div>
                <div className="w-16 h-16 mx-auto rounded-full bg-orange-400 text-orange-950 flex items-center justify-center shadow-lg border-2 border-orange-200">
                  <Medal className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-black text-base text-slate-900">{rankedStudents[2].studentName}</h4>
                  <div className="text-orange-900 font-mono text-[11px] font-bold">
                    Roll No. {rankedStudents[2].rollNo} • Sec {rankedStudents[2].section}
                  </div>
                </div>
                <div className="bg-white/90 p-3 rounded-xl border border-orange-200 font-mono space-y-1">
                  <div className="text-xs text-slate-500">Marks Secured</div>
                  <div className="text-xl font-black text-orange-900">
                    {rankedStudents[2].totalObtained} / {rankedStudents[2].totalMax}
                  </div>
                  <div className="text-xs font-bold text-emerald-700">
                    {rankedStudents[2].percentage}% (Grade A Bronze)
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onPrintReportCard(rankedStudents[2])}
                  className="w-full py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg text-xs shadow transition"
                >
                  Print Merit Award
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 6: OFFICIAL PROGRESS REPORT CARD PREVIEW */}
      {/* ============================================================ */}
      {activeTab === 'report_cards' && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Official Student Progress Report Card (Result Card)
              </h3>
              <p className="text-slate-500 text-xs">
                Select a student below to inspect or print the comprehensive term card
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedReportCard?.id || filteredMarks[0]?.id || ''}
                onChange={(e) => {
                  const target = filteredMarks.find((m) => m.id === e.target.value);
                  if (target) setSelectedReportCard(target);
                }}
                className="px-3 py-1.5 border border-slate-300 rounded font-semibold text-xs bg-white text-slate-800"
              >
                {filteredMarks.map((m) => (
                  <option key={m.id} value={m.id}>
                    Roll #{m.rollNo} — {m.studentName} ({m.overallGrade})
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => {
                  const target = selectedReportCard || filteredMarks[0];
                  if (target) onPrintReportCard(target);
                }}
                className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-bold text-xs flex items-center gap-1.5 shadow"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Card</span>
              </button>
            </div>
          </div>

          {/* Report Card Document Preview Container */}
          {(() => {
            const student = selectedReportCard || filteredMarks[0];
            if (!student) {
              return (
                <div className="bg-white rounded-lg p-8 text-center text-slate-500">
                  No student result data found for this class.
                </div>
              );
            }

            return (
              <div className="bg-white rounded-xl border-2 border-slate-300 p-6 shadow-md max-w-4xl mx-auto space-y-5 text-xs text-slate-800">
                {/* School Header */}
                <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center font-black text-base shadow">
                      TE
                    </div>
                    <div>
                      <h2 className="font-black text-lg text-slate-900 tracking-wide uppercase">
                        THE EDUCATORS
                      </h2>
                      <div className="text-[11px] text-slate-600 font-semibold">
                        A Project of Beaconhouse • Main Campus Lahore
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Registration No: REG-PEF-2018-8821 • Affiliated with BISE Lahore
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-black uppercase text-indigo-900 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-md">
                      STUDENT PROGRESS REPORT
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 font-mono">{selectedExam}</div>
                  </div>
                </div>

                {/* Student Credentials Box */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Student Name
                    </span>
                    <span className="font-bold text-slate-900 text-sm">{student.studentName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Roll Number
                    </span>
                    <span className="font-mono font-bold text-sky-800 text-sm">{student.rollNo}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Class &amp; Section
                    </span>
                    <span className="font-bold text-slate-800">
                      {student.className} (Sec {student.section})
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Academic Session
                    </span>
                    <span className="font-mono font-bold text-slate-800">2024 - 2025</span>
                  </div>
                </div>

                {/* Subject-Wise Marks Ledger */}
                <div className="border border-slate-300 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-[#0c1e38] text-white font-bold">
                      <tr>
                        <th className="py-2.5 px-3">Subject</th>
                        <th className="py-2.5 px-3 text-center">Max Marks</th>
                        <th className="py-2.5 px-3 text-center">Pass Marks</th>
                        <th className="py-2.5 px-3 text-center">Marks Obtained</th>
                        <th className="py-2.5 px-3 text-center">Grade</th>
                        <th className="py-2.5 px-3">Subject Teacher Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {student.subjectMarks.map((sub) => (
                        <tr key={sub.subject} className="hover:bg-slate-50">
                          <td className="py-2 px-3 font-bold text-slate-800">{sub.subject}</td>
                          <td className="py-2 px-3 text-center font-mono text-slate-600">
                            {sub.totalMarks}
                          </td>
                          <td className="py-2 px-3 text-center font-mono text-slate-500">40</td>
                          <td className="py-2 px-3 text-center font-mono font-bold text-slate-900">
                            {sub.obtainedMarks}
                          </td>
                          <td className="py-2 px-3 text-center font-bold text-indigo-900">
                            {sub.grade}
                          </td>
                          <td className="py-2 px-3 text-slate-600 text-[11px]">
                            {sub.obtainedMarks >= 85
                              ? 'Excellent understanding & analytical skills.'
                              : sub.obtainedMarks >= 70
                              ? 'Good progress. Needs practice in subjective essays.'
                              : 'Satisfactory. Regular revision recommended.'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-300 text-slate-900">
                      <tr>
                        <td className="py-2.5 px-3 uppercase">Grand Total</td>
                        <td className="py-2.5 px-3 text-center font-mono">{student.totalMax}</td>
                        <td className="py-2.5 px-3 text-center font-mono">160</td>
                        <td className="py-2.5 px-3 text-center font-mono font-extrabold text-emerald-900 text-sm">
                          {student.totalObtained}
                        </td>
                        <td className="py-2.5 px-3 text-center text-emerald-800 text-sm">
                          {student.overallGrade}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-indigo-900">
                          Percentage: {student.percentage}%
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Performance Summary & Grading Legend */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                    <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wide">
                      Grading Scale Matrix (BISE Punjab)
                    </div>
                    <div className="grid grid-cols-3 gap-1 text-[10px] text-slate-600 font-mono">
                      <div>85%+ : A+ (Exceptional)</div>
                      <div>75-84% : A (Excellent)</div>
                      <div>65-74% : B (Very Good)</div>
                      <div>55-64% : C (Good)</div>
                      <div>40-54% : D (Fair)</div>
                      <div>Below 40% : F (Fail)</div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                    <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wide">
                      Attendance &amp; Conduct Assessment
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Term Attendance:</span>
                      <span className="font-mono font-bold text-emerald-700">96.4% (Regular)</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Moral Conduct:</span>
                      <span className="font-semibold text-slate-800">Disciplined &amp; Polite</span>
                    </div>
                    <div className="text-[10px] text-slate-500 italic mt-1">
                      "{student.teacherRemarks || 'Capable student with great potential for higher board honors.'}"
                    </div>
                  </div>
                </div>

                {/* Official Signatures Row */}
                <div className="pt-8 border-t border-slate-300 grid grid-cols-3 gap-4 text-center text-[11px]">
                  <div>
                    <div className="w-32 border-b border-slate-700 mx-auto mb-1" />
                    <span className="font-bold text-slate-800 block">Class Teacher</span>
                    <span className="text-[10px] text-slate-400">Signature</span>
                  </div>

                  <div>
                    <div className="w-32 border-b border-slate-700 mx-auto mb-1" />
                    <span className="font-bold text-slate-800 block">Controller of Exams</span>
                    <span className="text-[10px] text-slate-400">Official Stamp</span>
                  </div>

                  <div>
                    <div className="w-32 border-b border-slate-700 mx-auto mb-1" />
                    <span className="font-bold text-slate-800 block">Executive Principal</span>
                    <span className="text-[10px] text-slate-400">Seal of Institution</span>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
