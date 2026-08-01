const permits = [
  {
    destination: "Annapurna Base Camp",
    permits: [
      {
        name: "ACAP Permit",
        cost: "NPR 3000",
        processing: "Same Day",
        office: "ACAP Office, Pokhara",
        documents: [
          "Passport",
          "Passport-size Photo"
        ]
      },
      {
        name: "TIMS Card",
        cost: "NPR 2000",
        processing: "Same Day",
        office: "TAAN Office",
        documents: [
          "Passport",
          "Travel Insurance"
        ]
      }
    ]
  },

  {
    destination: "Everest Base Camp",
    permits: [
      {
        name: "Khumbu Pasang Lhamu Permit",
        cost: "NPR 3000",
        processing: "Same Day",
        office: "Lukla Checkpost",
        documents: [
          "Passport"
        ]
      },

      {
        name: "Sagarmatha National Park Permit",
        cost: "NPR 3000",
        processing: "Same Day",
        office: "Monjo",
        documents: [
          "Passport"
        ]
      }
    ]
  },

  {
    destination: "Upper Mustang",
    permits: [
      {
        name: "Restricted Area Permit",
        cost: "USD 500",
        processing: "2-3 Days",
        office: "Department of Immigration",
        documents: [
          "Passport",
          "Guide Required"
        ]
      }
    ]
  }
];

export default permits;