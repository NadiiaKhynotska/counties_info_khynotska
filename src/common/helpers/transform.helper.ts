export class TransformHelper {
  public static toCapitalize({ value }) {
    if (value) {
      const lowerCaseValue = value.trim().toLowerCase();
      return lowerCaseValue.charAt(0).toUpperCase() + lowerCaseValue.slice(1);
    }
    return value;
  }

  public static toUpperCase({ value }) {
    return value ? value.trim().toUpperCase() : value;
  }
}
