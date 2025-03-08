const walkSpecificFields = {
  initialValues: {
    date: "",
    time: "",
    max_participants: "",
  },
  fields: [
    { name: "date", type: "date", label: "Date" },
    { name: "time", type: "time", label: "Heure" },
    {
      name: "max_participants",
      type: "number",
      label: "Nombre maximum de participants",
    },
  ],
};

export default walkSpecificFields;
