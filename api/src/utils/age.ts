export const calculateAge = (
  birthDate: Date,
  referenceDate: Date
): number => {
  let age =
    referenceDate.getFullYear() -
    birthDate.getFullYear();

  const birthdayNotReached =
    referenceDate.getMonth() <
      birthDate.getMonth() ||
    (
      referenceDate.getMonth() ===
        birthDate.getMonth() &&
      referenceDate.getDate() <
        birthDate.getDate()
    );

  if (birthdayNotReached) {
    age -= 1;
  }

  return age;
};
