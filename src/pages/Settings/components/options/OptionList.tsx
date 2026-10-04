import cx from 'clsx';
import {
  Bell,
  Database,
  Folder,
  Globe,
  Heart,
  Keyboard,
  KeyRound,
  Monitor,
  Settings as Cog,
  Volume2,
  type LucideIcon
} from 'lucide-react';
import { toast } from 'sonner';

import classes from './OptionList.module.scss';

type IProps = {
  query: string;
  onShortcuts: () => void;
};

type Option = {
  label: string;
  icon: LucideIcon;
  color: 'red' | 'green' | 'gray' | 'blue' | 'pink' | 'purple';
  value?: string;
  /** Opens a real screen instead of the "coming soon" notice. */
  action?: 'shortcuts';
  /** Hidden on touch devices (no physical keyboard). */
  desktopOnly?: boolean;
};

const SECTIONS: Option[][] = [
  [
    { label: 'Notifications and Sounds', icon: Bell, color: 'red' },
    { label: 'Data and Storage', icon: Database, color: 'green' },
    { label: 'Privacy and Security', icon: KeyRound, color: 'gray' },
    { label: 'General Settings', icon: Cog, color: 'gray' },
    { label: 'Chat Folders', icon: Folder, color: 'blue' },
    { label: 'Stickers and Emoji', icon: Heart, color: 'pink' },
    { label: 'Speakers and Camera', icon: Volume2, color: 'green' }
  ],
  [
    { label: 'Keyboard Shortcuts', icon: Keyboard, color: 'purple', action: 'shortcuts', desktopOnly: true },
    { label: 'Devices', icon: Monitor, color: 'blue' },
    { label: 'Language', icon: Globe, color: 'purple', value: 'English' }
  ]
];

const OptionList = ({ query, onShortcuts }: IProps) => {
  const search = query.trim().toLowerCase();
  const sections = SECTIONS.map(options =>
    options.filter(option => !search || option.label.toLowerCase().includes(search))
  ).filter(options => options.length > 0);

  if (!sections.length) return <p className={classes.empty}>Nothing found</p>;

  return (
    <>
      {sections.map(options => (
        <div key={options[0].label} className={classes.card}>
          {options.map(({ label, icon: Icon, color, value, action, desktopOnly }) => (
            <button
              key={label}
              type="button"
              className={cx(classes.option, desktopOnly && classes.desktopOnly)}
              onClick={() => (action === 'shortcuts' ? onShortcuts() : toast.info(`${label} — coming soon`))}
            >
              <span className={cx(classes.icon, classes[color])}>
                <Icon size={18} />
              </span>
              <span className={classes.label}>{label}</span>
              {value && <span className={classes.value}>{value}</span>}
            </button>
          ))}
        </div>
      ))}
    </>
  );
};

export default OptionList;
