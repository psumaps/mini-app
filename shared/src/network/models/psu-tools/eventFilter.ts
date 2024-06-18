export default interface Filter {
  id: string;
  name: string;
  values: {
    id: string;
    value: string;
    isChecked: boolean;
  }[];
}
