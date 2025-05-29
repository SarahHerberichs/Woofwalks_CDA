const walkSpecificFields = {
  initialValues: {
    datetime: "",
    max_participants: "",
  },
  fields: [
    { name: "datetime", type: "datetime-local", label: "Date et heure" },

    {
      name: "max_participants",
      type: "number",
      label: "Nombre maximum de participants",
    },
    {
      name: "use_custom_location",
      type: "radio",
      label: "Type de lieu",
      options: [
        { value: "custom", label: "Lieu personnalisé" },
        { value: "park", label: "Parc existant" },
      ],
    },
  ],
};

export default walkSpecificFields;
