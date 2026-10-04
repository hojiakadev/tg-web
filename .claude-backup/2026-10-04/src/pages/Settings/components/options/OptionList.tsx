import {
  Bell,
  Database,
  Folder,
  Globe,
  Heart,
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
};

type Option = { label: string; icon: LucideIcon; color: string; value?: string };

const SECTIONS: Option[][] = [
  [
    { label: 'Notifications and Sounds', icon: Bell, color: '#f0624e' },
    { label: 'Data and Storage', icon: Database, color: '#4fae4e' },
    { label: 'Privacy and Security', icon: KeyRound, color: '#8e99a4' },
    { label: 'General Settings', icon: Cog, color: '#8e99a4' },
    { label: 'Chat Folders', icon: Folder, color: '#3390ec' },
    { label: 'Stickers and Emoji', icon: Heart, color: '#e5547d' },
    { label: 'Speakers and Camera', icon: Volume2, color: '#4fae4e' }
  ],
  [
    { label: 'Devices', icon: Monitor, color: '#3390ec' },
    { label: 'Language', icon: Globe, color: '#a86de8', value: 'English' }
  ]
];

const OptionList = ({ query }: IProps) => {
  const search = query.trim().toLowerCase();
  const sections = SECTIONS.map(options =>
    options.filter(option => !search || option.label.toLowerCase().includes(search))
  ).filter(options => options.length > 0);

  if (!sections.length) return <p className={classes.empty}>Nothing found</p>;

  return (
    <>
      {sections.map(options => (
        <div key={options[0].label} className={classes.card}>
          {options.map(({ label, icon: Icon, color, value }) => (
            <button
              key={label}
              type="button"
              className={classes.option}
              onClick={() => toast.info(`${label} — coming soon`)}
            >
              <span className={classes.icon} style={{ backgroundColor: color }}>
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
