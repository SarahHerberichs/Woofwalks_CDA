const walkSpecificFields = {
  initialValues: {
    datetime: "", // Fusionner date et heure en un seul champ
    time: "",
    max_participants: "",
  },
  fields: [
    { name: "datetime", type: "datetime-local", label: "Date et heure" },

    {
      name: "max_participants",
      type: "number",
      label: "Nombre maximum de participants",
    },
  ],
};

export default walkSpecificFields;
