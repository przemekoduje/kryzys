export interface PozarStep {
  id: 'warning' | 'cutoff' | 'smother' | 'timer';
  title: string;
  description: string;
  colorCode: string;
  iconName: string;
}
