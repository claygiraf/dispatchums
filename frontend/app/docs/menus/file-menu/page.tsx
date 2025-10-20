// frontend/app/docs/menus/file-menu/page.tsx
import Link from 'next/link';
import { 
  FileText, 
  FolderOpen, 
  X, 
  Phone, 
  PauseCircle, 
  PlayCircle, 
  Edit3, 
  Printer, 
  LogOut,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';

export default function FileMenuPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-[#27272A]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="group">
              <h1 className="text-3xl font-serif text-white tracking-wide hover:text-[#1D9BF0] transition">
                DISPATCHUMS
              </h1>
            </Link>
            <Link 
              href="/docs/menus" 
              className="flex items-center gap-2 text-[#9CA3AF] hover:text-white transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-['Inter']">Back to Menus</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1D9BF0]/10 border border-[#1D9BF0]/20 rounded-full mb-6">
              <FileText className="w-4 h-4 text-[#1D9BF0]" />
              <span className="text-sm font-['Inter'] text-[#1D9BF0]">Medical Priority Dispatch</span>
            </div>
            <h1 className="text-5xl font-serif text-white mb-4">File Menu</h1>
            <p className="text-xl text-[#9CA3AF] font-['Inter']">
              Case management and system operations
            </p>
          </div>

          {/* Menu Items */}
          <div className="space-y-6">
            {/* New Case */}
            <MenuCard
              icon={<FileText className="w-6 h-6" />}
              title="File | New Case"
              shortcut="Ctrl+N"
              description="Start a new case"
              note="This command is not available for CAD-interfaced installations."
            />

            {/* Open Case */}
            <MenuCard
              icon={<FolderOpen className="w-6 h-6" />}
              title="File | Open Case"
              shortcut="Ctrl+O"
              description="Open a previously completed or aborted case"
              details={
                <div className="mt-4 space-y-3">
                  <p className="text-[#9CA3AF] font-['Inter']">
                    The <span className="text-white font-medium">Search for Incident Number</span> dialog box appears.
                  </p>
                  <div className="bg-[#0A0A0A] border border-[#27272A] rounded-lg p-4">
                    <p className="text-sm text-[#9CA3AF] font-['Inter']">
                      Double-click on the case you want to open or select the appropriate case and click on the <span className="text-[#10B981]">OK</span> button.
                    </p>
                  </div>
                </div>
              }
            />

            {/* Close Case */}
            <MenuCard
              icon={<X className="w-6 h-6" />}
              title="File | Close Case"
              shortcut="Ctrl+F4"
              description="Close a case"
              details={
                <div className="mt-4 space-y-3">
                  <div className="bg-[#1D9BF0]/5 border border-[#1D9BF0]/20 rounded-lg p-4">
                    <h4 className="text-white font-medium font-['Inter'] mb-2">If case not dispatched:</h4>
                    <p className="text-sm text-[#9CA3AF] font-['Inter']">
                      ProQA will ask for the reason you are aborting the case. Select the appropriate reason from the list, or type the reason in the free text field, and click <span className="text-[#10B981]">OK</span>.
                    </p>
                  </div>
                  <p className="text-xs text-[#9CA3AF] font-['Inter'] italic">
                    Note: The system administrator can configure the system to disable the free text field.
                  </p>
                </div>
              }
            />

            {/* Caller Hangup */}
            <MenuCard
              icon={<Phone className="w-6 h-6" />}
              title="File | Caller Hangup"
              description="Close a case when caller disconnects before dispatch"
              note="This is essentially the same as aborting a case except you are not asked for an abort reason."
            />

            {/* Hold Case */}
            <MenuCard
              icon={<PauseCircle className="w-6 h-6" />}
              title="File | Hold Case"
              description="Place a case on hold"
              warning="The elapsed time indicator continues to run while the case is on hold."
              note="This command may be disabled. This decision is made by the local agency or CAD vendor."
            />

            {/* Pick-up Case */}
            <MenuCard
              icon={<PlayCircle className="w-6 h-6" />}
              title="File | Pick-up Case"
              description="Return to a case that has been placed on hold"
              note="This command is not available for CAD-interfaced installations. If your agency uses a CAD interface, you must use your CAD system to pick up a case on hold."
              details={
                <div className="mt-4 space-y-3">
                  <p className="text-[#9CA3AF] font-['Inter']">
                    The <span className="text-white font-medium">Pick-up case</span> dialog box appears.
                  </p>
                  <div className="bg-[#0A0A0A] border border-[#27272A] rounded-lg p-4">
                    <p className="text-sm text-[#9CA3AF] font-['Inter']">
                      Double-click on the case you want to pick-up, or select the appropriate case and click <span className="text-[#10B981]">OK</span>.
                    </p>
                  </div>
                  <div className="bg-[#10B981]/5 border border-[#10B981]/20 rounded-lg p-4">
                    <p className="text-sm text-[#9CA3AF] font-['Inter']">
                      Cases placed on hold from another workstation are available for pick-up if the computers share ProQA database files.
                    </p>
                  </div>
                </div>
              }
            />

            {/* Change Case Number */}
            <MenuCard
              icon={<Edit3 className="w-6 h-6" />}
              title="File | Change Case Number"
              description="Change the control number used to identify the case"
              details={
                <div className="mt-4 space-y-3">
                  <p className="text-[#9CA3AF] font-['Inter']">
                    The <span className="text-white font-medium">Change case number</span> dialog box appears.
                  </p>
                  <div className="bg-[#0A0A0A] border border-[#27272A] rounded-lg p-4">
                    <p className="text-sm text-[#9CA3AF] font-['Inter']">
                      Simply type the new case number in the text box and click <span className="text-[#10B981]">OK</span>.
                    </p>
                  </div>
                </div>
              }
            />

            {/* Print Case */}
            <MenuCard
              icon={<Printer className="w-6 h-6" />}
              title="File | Print Case"
              description="Print a case summary"
              note="If no case is currently open, the Search for Incident Number dialog box appears allowing you to select the case to print."
              details={
                <div className="mt-4 space-y-3">
                  <p className="text-[#9CA3AF] font-['Inter'] mb-3">
                    The <span className="text-white font-medium">Print Case Summary</span> dialog box appears.
                  </p>
                  <div className="bg-[#0A0A0A] border border-[#27272A] rounded-lg p-4">
                    <h4 className="text-white font-medium font-['Inter'] mb-3">Print Options Include:</h4>
                    <ul className="space-y-2 text-sm text-[#9CA3AF] font-['Inter']">
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-[#1D9BF0] mt-0.5 flex-shrink-0" />
                        <span>Case information</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-[#1D9BF0] mt-0.5 flex-shrink-0" />
                        <span>Case Entry answers</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-[#1D9BF0] mt-0.5 flex-shrink-0" />
                        <span>Key Question answers</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-[#1D9BF0] mt-0.5 flex-shrink-0" />
                        <span>Dispatch information</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-[#1D9BF0] mt-0.5 flex-shrink-0" />
                        <span>Time stamps</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-[#1D9BF0] mt-0.5 flex-shrink-0" />
                        <span>Sequence of events</span>
                      </li>
                    </ul>
                  </div>
                  <p className="text-sm text-[#9CA3AF] font-['Inter']">
                    Simply select the information you want printed and click the <span className="text-[#10B981]">Print</span> button.
                  </p>
                </div>
              }
            />

            {/* Exit */}
            <MenuCard
              icon={<LogOut className="w-6 h-6" />}
              title="File | Exit"
              description="Exit ProQA"
              warning="If you have not dispatched the current case, you will be asked for the reason you are aborting the case."
              details={
                <div className="mt-4 space-y-3">
                  <p className="text-[#9CA3AF] font-['Inter'] mb-3">
                    Depending on your system settings, the <span className="text-white font-medium">Logoff confirmation</span> dialog box may appear.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#0A0A0A] border border-[#27272A] rounded-lg p-4">
                      <h4 className="text-white font-medium font-['Inter'] mb-2">Click Yes:</h4>
                      <p className="text-sm text-[#9CA3AF] font-['Inter']">
                        Exit ProQA and logoff
                      </p>
                    </div>
                    <div className="bg-[#0A0A0A] border border-[#27272A] rounded-lg p-4">
                      <h4 className="text-white font-medium font-['Inter'] mb-2">Click No:</h4>
                      <p className="text-sm text-[#9CA3AF] font-['Inter']">
                        Exit ProQA without logging off (only if you will be the next person to open ProQA)
                      </p>
                    </div>
                  </div>
                </div>
              }
            />
          </div>

          {/* Quick Reference */}
          <div className="mt-12 bg-gradient-to-br from-[#1D9BF0]/5 to-[#10B981]/5 border border-[#27272A] rounded-2xl p-8">
            <h2 className="text-2xl font-serif text-white mb-6">Keyboard Shortcuts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ShortcutItem command="New Case" shortcut="Ctrl+N" />
              <ShortcutItem command="Open Case" shortcut="Ctrl+O" />
              <ShortcutItem command="Close Case" shortcut="Ctrl+F4" />
              <ShortcutItem command="Print Case" shortcut="Ctrl+P" />
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-12 flex items-center justify-between">
            <Link 
              href="/docs/menus"
              className="flex items-center gap-2 text-[#9CA3AF] hover:text-white transition font-['Inter']"
            >
              <ArrowLeft className="w-4 h-4" />
              All Menus
            </Link>
            <Link 
              href="/docs/menus/view-menu"
              className="flex items-center gap-2 text-[#1D9BF0] hover:text-white transition font-['Inter']"
            >
              Next: View Menu
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

// Component for menu cards
function MenuCard({ 
  icon, 
  title, 
  shortcut, 
  description, 
  note, 
  warning,
  details 
}: {
  icon: React.ReactNode;
  title: string;
  shortcut?: string;
  description: string;
  note?: string;
  warning?: string;
  details?: React.ReactNode;
}) {
  return (
    <div className="bg-[#0A0A0A] border border-[#27272A] rounded-xl p-6 hover:border-[#1D9BF0]/30 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#1D9BF0]/10 border border-[#1D9BF0]/20 rounded-lg flex items-center justify-center text-[#1D9BF0]">
            {icon}
          </div>
          <div>
            <h3 className="text-xl font-['Inter'] text-white font-medium">{title}</h3>
            {shortcut && (
              <code className="text-sm text-[#9CA3AF] font-mono mt-1 inline-block">
                {shortcut}
              </code>
            )}
          </div>
        </div>
      </div>
      
      <p className="text-[#9CA3AF] font-['Inter'] leading-relaxed">
        {description}
      </p>

      {note && (
        <div className="mt-4 bg-[#1D9BF0]/5 border border-[#1D9BF0]/20 rounded-lg p-4">
          <p className="text-sm text-[#9CA3AF] font-['Inter']">
            <span className="text-[#1D9BF0] font-medium">Note:</span> {note}
          </p>
        </div>
      )}

      {warning && (
        <div className="mt-4 bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
          <p className="text-sm text-[#9CA3AF] font-['Inter']">
            <span className="text-yellow-500 font-medium">⚠ Warning:</span> {warning}
          </p>
        </div>
      )}

      {details}
    </div>
  );
}

// Component for keyboard shortcuts
function ShortcutItem({ command, shortcut }: { command: string; shortcut: string }) {
  return (
    <div className="flex items-center justify-between p-3 bg-[#0A0A0A]/50 border border-[#27272A] rounded-lg">
      <span className="text-sm font-['Inter'] text-[#9CA3AF]">{command}</span>
      <code className="px-3 py-1 bg-[#27272A] text-[#1D9BF0] text-sm font-mono rounded">
        {shortcut}
      </code>
    </div>
  );
}