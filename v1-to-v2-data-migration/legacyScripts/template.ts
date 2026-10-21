export const template = [
  {
    id: 'v2.birth',
    dateOfEvent: {
      fieldId: 'child.dob',
    },
    title: {
      id: 'v2.event.birth.title',
      defaultMessage: '{child.firstname} {child.surname}',
      description: 'This is the title of the summary',
    },
    fallbackTitle: {
      id: 'v2.event.tennis-club-membership.fallbackTitle',
      defaultMessage: 'No name provided',
      description:
        'This is a fallback title if actual title resolves to empty string',
    },
    summary: {
      fields: [
        {
          emptyValueMessage: {
            id: 'v2.event.birth.summary.child.dob.empty',
            defaultMessage: 'No date of birth',
            description: 'This is shown when there is no child information',
          },
          fieldId: 'child.dob',
        },
        {
          emptyValueMessage: {
            id: 'v2.event.birth.summary.child.placeOfBirth.empty',
            defaultMessage: 'No place of birth',
            description: 'This is shown when there is no child information',
          },
          conditionals: [
            {
              type: 'SHOW',
              conditional: {
                type: 'object',
                properties: {
                  $form: {
                    type: 'object',
                    properties: {
                      'child.placeOfBirth': {
                        anyOf: [
                          {
                            const: 'undefined',
                          },
                          {
                            const: false,
                          },
                          {
                            const: null,
                          },
                          {
                            const: '',
                          },
                        ],
                      },
                    },
                    anyOf: [
                      {
                        required: ['child.placeOfBirth'],
                      },
                      {
                        not: {
                          required: ['child.placeOfBirth'],
                        },
                      },
                    ],
                  },
                },
                required: ['$form'],
              },
            },
          ],
          fieldId: 'child.placeOfBirth',
          label: {
            id: 'v2.event.birth.summary.child.placeOfBirth.label',
            defaultMessage: 'Place of birth',
            description: 'Label for place of birth',
          },
        },
        {
          emptyValueMessage: {
            id: 'v2.event.birth.summary.child.placeOfBirth.empty',
            defaultMessage: 'No place of birth',
            description: 'This is shown when there is no child information',
          },
          conditionals: [
            {
              type: 'SHOW',
              conditional: {
                type: 'object',
                properties: {
                  $form: {
                    type: 'object',
                    properties: {
                      'child.placeOfBirth': {
                        oneOf: [
                          {
                            type: 'string',
                            const: 'HEALTH_FACILITY',
                          },
                          {
                            type: 'boolean',
                            const: 'HEALTH_FACILITY',
                          },
                        ],
                        const: 'HEALTH_FACILITY',
                      },
                    },
                    required: ['child.placeOfBirth'],
                  },
                },
                required: ['$form'],
              },
            },
          ],
          fieldId: 'child.birthLocation',
          label: {
            id: 'v2.event.birth.summary.child.placeOfBirth.label',
            defaultMessage: 'Place of birth',
            description: 'Label for place of birth',
          },
        },
        {
          emptyValueMessage: {
            id: 'v2.event.birth.summary.child.placeOfBirth.empty',
            defaultMessage: 'No place of birth',
            description: 'This is shown when there is no child information',
          },
          conditionals: [
            {
              type: 'SHOW',
              conditional: {
                type: 'object',
                properties: {
                  $form: {
                    type: 'object',
                    properties: {
                      'child.placeOfBirth': {
                        oneOf: [
                          {
                            type: 'string',
                            const: 'PRIVATE_HOME',
                          },
                          {
                            type: 'boolean',
                            const: 'PRIVATE_HOME',
                          },
                        ],
                        const: 'PRIVATE_HOME',
                      },
                    },
                    required: ['child.placeOfBirth'],
                  },
                },
                required: ['$form'],
              },
            },
          ],
          fieldId: 'child.address.privateHome',
          label: {
            id: 'v2.event.birth.summary.child.placeOfBirth.label',
            defaultMessage: 'Place of birth',
            description: 'Label for place of birth',
          },
        },
        {
          emptyValueMessage: {
            id: 'v2.event.birth.summary.child.placeOfBirth.empty',
            defaultMessage: 'No place of birth',
            description: 'This is shown when there is no child information',
          },
          conditionals: [
            {
              type: 'SHOW',
              conditional: {
                type: 'object',
                properties: {
                  $form: {
                    type: 'object',
                    properties: {
                      'child.placeOfBirth': {
                        oneOf: [
                          {
                            type: 'string',
                            const: 'OTHER',
                          },
                          {
                            type: 'boolean',
                            const: 'OTHER',
                          },
                        ],
                        const: 'OTHER',
                      },
                    },
                    required: ['child.placeOfBirth'],
                  },
                },
                required: ['$form'],
              },
            },
          ],
          fieldId: 'child.address.other',
          label: {
            id: 'v2.event.birth.summary.child.placeOfBirth.label',
            defaultMessage: 'Place of birth',
            description: 'Label for place of birth',
          },
        },
        {
          emptyValueMessage: {
            id: 'v2.event.birth.summary.informant.contact.empty',
            defaultMessage: 'No contact details provided',
            description: 'This is shown when there is no informant information',
          },
          id: 'informant.contact',
          value: {
            id: 'v2.event.birth.summary.informant.contact.value',
            defaultMessage: '{informant.phoneNo} {informant.email}',
            description: 'This is the contact value of the informant',
          },
          label: {
            id: 'v2.event.birth.summary.informant.contact.label',
            defaultMessage: 'Contact',
            description: 'This is the label for the informant information',
          },
        },
      ],
    },
    label: {
      id: 'v2.event.birth.label',
      defaultMessage: 'Birth',
      description: 'This is what this event is referred as in the system',
    },
    actions: [
      {
        label: {
          id: 'v2.event.birth.action.Read.label',
          defaultMessage: 'Read',
          description:
            'This is shown as the action name anywhere the user can trigger the action from',
        },
        conditionals: [],
        type: 'READ',
        review: {
          title: {
            id: 'v2.event.birth.action.declare.form.review.title',
            defaultMessage:
              '{child.firstname, select, __EMPTY__ {Birth declaration} other {{child.surname, select, __EMPTY__ {Birth declaration} other {Birth declaration for {child.firstname} {child.surname}}}}}',
            description: 'Title of the form to show in review page',
          },
          fields: [
            {
              id: 'review.comment',
              required: true,
              label: {
                id: 'v2.event.birth.action.declare.form.review.comment.label',
                defaultMessage: 'Comment',
                description:
                  'Label for the comment field in the review section',
              },
              type: 'TEXTAREA',
            },
            {
              id: 'review.signature',
              required: true,
              label: {
                id: 'v2.event.birth.action.declare.form.review.signature.label',
                defaultMessage: 'Signature of informant',
                description:
                  'Label for the signature field in the review section',
              },
              type: 'SIGNATURE',
              signaturePromptLabel: {
                id: 'v2.signature.upload.modal.title',
                defaultMessage: 'Draw signature',
                description: 'Title for the modal to draw signature',
              },
              configuration: {
                maxFileSize: 5242880,
              },
            },
          ],
        },
      },
      {
        label: {
          id: 'v2.event.birth.action.declare.label',
          defaultMessage: 'Declare',
          description:
            'This is shown as the action name anywhere the user can trigger the action from',
        },
        conditionals: [],
        type: 'DECLARE',
        review: {
          title: {
            id: 'v2.event.birth.action.declare.form.review.title',
            defaultMessage:
              '{child.firstname, select, __EMPTY__ {Birth declaration} other {{child.surname, select, __EMPTY__ {Birth declaration} other {Birth declaration for {child.firstname} {child.surname}}}}}',
            description: 'Title of the form to show in review page',
          },
          fields: [
            {
              id: 'review.comment',
              required: true,
              label: {
                id: 'v2.event.birth.action.declare.form.review.comment.label',
                defaultMessage: 'Comment',
                description:
                  'Label for the comment field in the review section',
              },
              type: 'TEXTAREA',
            },
            {
              id: 'review.signature',
              required: true,
              label: {
                id: 'v2.event.birth.action.declare.form.review.signature.label',
                defaultMessage: 'Signature of informant',
                description:
                  'Label for the signature field in the review section',
              },
              type: 'SIGNATURE',
              signaturePromptLabel: {
                id: 'v2.signature.upload.modal.title',
                defaultMessage: 'Draw signature',
                description: 'Title for the modal to draw signature',
              },
              configuration: {
                maxFileSize: 5242880,
              },
            },
          ],
        },
      },
      {
        label: {
          id: 'v2.event.birth.action.validate.label',
          defaultMessage: 'Validate',
          description:
            'This is shown as the action name anywhere the user can trigger the action from',
        },
        conditionals: [],
        type: 'VALIDATE',
        review: {
          title: {
            id: 'v2.event.birth.action.declare.form.review.title',
            defaultMessage:
              '{child.firstname, select, __EMPTY__ {Birth declaration} other {{child.surname, select, __EMPTY__ {Birth declaration} other {Birth declaration for {child.firstname} {child.surname}}}}}',
            description: 'Title of the form to show in review page',
          },
          fields: [
            {
              id: 'review.comment',
              required: true,
              label: {
                id: 'v2.event.birth.action.declare.form.review.comment.label',
                defaultMessage: 'Comment',
                description:
                  'Label for the comment field in the review section',
              },
              type: 'TEXTAREA',
            },
            {
              id: 'review.signature',
              required: true,
              label: {
                id: 'v2.event.birth.action.declare.form.review.signature.label',
                defaultMessage: 'Signature of informant',
                description:
                  'Label for the signature field in the review section',
              },
              type: 'SIGNATURE',
              signaturePromptLabel: {
                id: 'v2.signature.upload.modal.title',
                defaultMessage: 'Draw signature',
                description: 'Title for the modal to draw signature',
              },
              configuration: {
                maxFileSize: 5242880,
              },
            },
          ],
        },
      },
      {
        label: {
          id: 'v2.event.birth.action.register.label',
          defaultMessage: 'Register',
          description:
            'This is shown as the action name anywhere the user can trigger the action from',
        },
        conditionals: [],
        type: 'REGISTER',
        review: {
          title: {
            id: 'v2.event.birth.action.declare.form.review.title',
            defaultMessage:
              '{child.firstname, select, __EMPTY__ {Birth declaration} other {{child.surname, select, __EMPTY__ {Birth declaration} other {Birth declaration for {child.firstname} {child.surname}}}}}',
            description: 'Title of the form to show in review page',
          },
          fields: [
            {
              id: 'review.comment',
              required: true,
              label: {
                id: 'v2.event.birth.action.declare.form.review.comment.label',
                defaultMessage: 'Comment',
                description:
                  'Label for the comment field in the review section',
              },
              type: 'TEXTAREA',
            },
            {
              id: 'review.signature',
              required: true,
              label: {
                id: 'v2.event.birth.action.declare.form.review.signature.label',
                defaultMessage: 'Signature of informant',
                description:
                  'Label for the signature field in the review section',
              },
              type: 'SIGNATURE',
              signaturePromptLabel: {
                id: 'v2.signature.upload.modal.title',
                defaultMessage: 'Draw signature',
                description: 'Title for the modal to draw signature',
              },
              configuration: {
                maxFileSize: 5242880,
              },
            },
          ],
        },
      },
      {
        label: {
          id: 'v2.event.birth.action.collect-certificate.label',
          defaultMessage: 'Print certificate',
          description:
            'This is shown as the action name anywhere the user can trigger the action from',
        },
        conditionals: [],
        type: 'PRINT_CERTIFICATE',
        printForm: {
          label: {
            id: 'v2.event.birth.action.certificate.form.label',
            defaultMessage: 'Birth certificate collector',
            description: 'This is what this form is referred as in the system',
          },
          pages: [
            {
              id: 'collector',
              title: {
                id: 'v2.event.birth.action.certificate.form.section.who.title',
                defaultMessage: 'Certify record',
                description: 'This is the title of the section',
              },
              fields: [
                {
                  id: 'collector.requesterId',
                  conditionals: [
                    {
                      type: 'SHOW',
                      conditional: {
                        type: 'object',
                        allOf: [
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'informant.relation': {
                                    oneOf: [
                                      {
                                        type: 'string',
                                        const: 'MOTHER',
                                      },
                                      {
                                        type: 'boolean',
                                        const: 'MOTHER',
                                      },
                                    ],
                                    const: 'MOTHER',
                                  },
                                },
                                required: ['informant.relation'],
                              },
                            },
                            required: ['$form'],
                          },
                          {
                            type: 'object',
                            not: {
                              type: 'object',
                              properties: {
                                $form: {
                                  type: 'object',
                                  properties: {
                                    'mother.firstname': {
                                      anyOf: [
                                        {
                                          const: 'undefined',
                                        },
                                        {
                                          const: false,
                                        },
                                        {
                                          const: null,
                                        },
                                        {
                                          const: '',
                                        },
                                      ],
                                    },
                                  },
                                  anyOf: [
                                    {
                                      required: ['mother.firstname'],
                                    },
                                    {
                                      not: {
                                        required: ['mother.firstname'],
                                      },
                                    },
                                  ],
                                },
                              },
                              required: ['$form'],
                            },
                            required: [],
                          },
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'father.firstname': {
                                    anyOf: [
                                      {
                                        const: 'undefined',
                                      },
                                      {
                                        const: false,
                                      },
                                      {
                                        const: null,
                                      },
                                      {
                                        const: '',
                                      },
                                    ],
                                  },
                                },
                                anyOf: [
                                  {
                                    required: ['father.firstname'],
                                  },
                                  {
                                    not: {
                                      required: ['father.firstname'],
                                    },
                                  },
                                ],
                              },
                            },
                            required: ['$form'],
                          },
                        ],
                        required: [],
                      },
                    },
                  ],
                  required: true,
                  label: {
                    id: 'v2.event.birth.action.certificate.form.section.requester.label',
                    defaultMessage: 'Requester',
                    description: 'This is the label for the field',
                  },
                  type: 'SELECT',
                  options: [
                    {
                      value: 'INFORMANT',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.informant.mother.label',
                        defaultMessage: 'Print and issue to Informant (Mother)',
                        description: 'This is the label for the field',
                      },
                    },
                    {
                      value: 'SOMEONE_ELSE',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.other.label',
                        defaultMessage: 'Print and issue to someone else',
                        description: 'This is the label for the field',
                      },
                    },
                  ],
                },
                {
                  id: 'collector.requesterId',
                  conditionals: [
                    {
                      type: 'SHOW',
                      conditional: {
                        type: 'object',
                        allOf: [
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'informant.relation': {
                                    oneOf: [
                                      {
                                        type: 'string',
                                        const: 'MOTHER',
                                      },
                                      {
                                        type: 'boolean',
                                        const: 'MOTHER',
                                      },
                                    ],
                                    const: 'MOTHER',
                                  },
                                },
                                required: ['informant.relation'],
                              },
                            },
                            required: ['$form'],
                          },
                          {
                            type: 'object',
                            not: {
                              type: 'object',
                              properties: {
                                $form: {
                                  type: 'object',
                                  properties: {
                                    'father.firstname': {
                                      anyOf: [
                                        {
                                          const: 'undefined',
                                        },
                                        {
                                          const: false,
                                        },
                                        {
                                          const: null,
                                        },
                                        {
                                          const: '',
                                        },
                                      ],
                                    },
                                  },
                                  anyOf: [
                                    {
                                      required: ['father.firstname'],
                                    },
                                    {
                                      not: {
                                        required: ['father.firstname'],
                                      },
                                    },
                                  ],
                                },
                              },
                              required: ['$form'],
                            },
                            required: [],
                          },
                          {
                            type: 'object',
                            not: {
                              type: 'object',
                              properties: {
                                $form: {
                                  type: 'object',
                                  properties: {
                                    'mother.firstname': {
                                      anyOf: [
                                        {
                                          const: 'undefined',
                                        },
                                        {
                                          const: false,
                                        },
                                        {
                                          const: null,
                                        },
                                        {
                                          const: '',
                                        },
                                      ],
                                    },
                                  },
                                  anyOf: [
                                    {
                                      required: ['mother.firstname'],
                                    },
                                    {
                                      not: {
                                        required: ['mother.firstname'],
                                      },
                                    },
                                  ],
                                },
                              },
                              required: ['$form'],
                            },
                            required: [],
                          },
                        ],
                        required: [],
                      },
                    },
                  ],
                  required: true,
                  label: {
                    id: 'v2.event.birth.action.certificate.form.section.requester.label',
                    defaultMessage: 'Requester',
                    description: 'This is the label for the field',
                  },
                  type: 'SELECT',
                  options: [
                    {
                      value: 'INFORMANT',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.informant.mother.label',
                        defaultMessage: 'Print and issue to Informant (Mother)',
                        description: 'This is the label for the field',
                      },
                    },
                    {
                      value: 'FATHER',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.father.label',
                        defaultMessage: 'Print and issue to Father',
                        description: 'This is the label for the field',
                      },
                    },
                    {
                      value: 'SOMEONE_ELSE',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.other.label',
                        defaultMessage: 'Print and issue to someone else',
                        description: 'This is the label for the field',
                      },
                    },
                  ],
                },
                {
                  id: 'collector.requesterId',
                  conditionals: [
                    {
                      type: 'SHOW',
                      conditional: {
                        type: 'object',
                        allOf: [
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'informant.relation': {
                                    oneOf: [
                                      {
                                        type: 'string',
                                        const: 'FATHER',
                                      },
                                      {
                                        type: 'boolean',
                                        const: 'FATHER',
                                      },
                                    ],
                                    const: 'FATHER',
                                  },
                                },
                                required: ['informant.relation'],
                              },
                            },
                            required: ['$form'],
                          },
                          {
                            type: 'object',
                            not: {
                              type: 'object',
                              properties: {
                                $form: {
                                  type: 'object',
                                  properties: {
                                    'father.firstname': {
                                      anyOf: [
                                        {
                                          const: 'undefined',
                                        },
                                        {
                                          const: false,
                                        },
                                        {
                                          const: null,
                                        },
                                        {
                                          const: '',
                                        },
                                      ],
                                    },
                                  },
                                  anyOf: [
                                    {
                                      required: ['father.firstname'],
                                    },
                                    {
                                      not: {
                                        required: ['father.firstname'],
                                      },
                                    },
                                  ],
                                },
                              },
                              required: ['$form'],
                            },
                            required: [],
                          },
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'mother.firstname': {
                                    anyOf: [
                                      {
                                        const: 'undefined',
                                      },
                                      {
                                        const: false,
                                      },
                                      {
                                        const: null,
                                      },
                                      {
                                        const: '',
                                      },
                                    ],
                                  },
                                },
                                anyOf: [
                                  {
                                    required: ['mother.firstname'],
                                  },
                                  {
                                    not: {
                                      required: ['mother.firstname'],
                                    },
                                  },
                                ],
                              },
                            },
                            required: ['$form'],
                          },
                        ],
                        required: [],
                      },
                    },
                  ],
                  required: true,
                  label: {
                    id: 'v2.event.birth.action.certificate.form.section.requester.label',
                    defaultMessage: 'Requester',
                    description: 'This is the label for the field',
                  },
                  type: 'SELECT',
                  options: [
                    {
                      value: 'INFORMANT',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.informant.father.label',
                        defaultMessage: 'Print and issue to Informant (Father)',
                        description: 'This is the label for the field',
                      },
                    },
                    {
                      value: 'SOMEONE_ELSE',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.other.label',
                        defaultMessage: 'Print and issue to someone else',
                        description: 'This is the label for the field',
                      },
                    },
                  ],
                },
                {
                  id: 'collector.requesterId',
                  conditionals: [
                    {
                      type: 'SHOW',
                      conditional: {
                        type: 'object',
                        allOf: [
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'informant.relation': {
                                    oneOf: [
                                      {
                                        type: 'string',
                                        const: 'FATHER',
                                      },
                                      {
                                        type: 'boolean',
                                        const: 'FATHER',
                                      },
                                    ],
                                    const: 'FATHER',
                                  },
                                },
                                required: ['informant.relation'],
                              },
                            },
                            required: ['$form'],
                          },
                          {
                            type: 'object',
                            not: {
                              type: 'object',
                              properties: {
                                $form: {
                                  type: 'object',
                                  properties: {
                                    'father.firstname': {
                                      anyOf: [
                                        {
                                          const: 'undefined',
                                        },
                                        {
                                          const: false,
                                        },
                                        {
                                          const: null,
                                        },
                                        {
                                          const: '',
                                        },
                                      ],
                                    },
                                  },
                                  anyOf: [
                                    {
                                      required: ['father.firstname'],
                                    },
                                    {
                                      not: {
                                        required: ['father.firstname'],
                                      },
                                    },
                                  ],
                                },
                              },
                              required: ['$form'],
                            },
                            required: [],
                          },
                          {
                            type: 'object',
                            not: {
                              type: 'object',
                              properties: {
                                $form: {
                                  type: 'object',
                                  properties: {
                                    'mother.firstname': {
                                      anyOf: [
                                        {
                                          const: 'undefined',
                                        },
                                        {
                                          const: false,
                                        },
                                        {
                                          const: null,
                                        },
                                        {
                                          const: '',
                                        },
                                      ],
                                    },
                                  },
                                  anyOf: [
                                    {
                                      required: ['mother.firstname'],
                                    },
                                    {
                                      not: {
                                        required: ['mother.firstname'],
                                      },
                                    },
                                  ],
                                },
                              },
                              required: ['$form'],
                            },
                            required: [],
                          },
                        ],
                        required: [],
                      },
                    },
                  ],
                  required: true,
                  label: {
                    id: 'v2.event.birth.action.certificate.form.section.requester.label',
                    defaultMessage: 'Requester',
                    description: 'This is the label for the field',
                  },
                  type: 'SELECT',
                  options: [
                    {
                      value: 'INFORMANT',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.informant.father.label',
                        defaultMessage: 'Print and issue to Informant (Father)',
                        description: 'This is the label for the field',
                      },
                    },
                    {
                      value: 'MOTHER',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.mother.label',
                        defaultMessage: 'Print and issue to Mother',
                        description: 'This is the label for the field',
                      },
                    },
                    {
                      value: 'SOMEONE_ELSE',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.other.label',
                        defaultMessage: 'Print and issue to someone else',
                        description: 'This is the label for the field',
                      },
                    },
                  ],
                },
                {
                  id: 'collector.requesterId',
                  conditionals: [
                    {
                      type: 'SHOW',
                      conditional: {
                        type: 'object',
                        allOf: [
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'informant.relation': {
                                    oneOf: [
                                      {
                                        type: 'string',
                                        const: 'OTHER',
                                      },
                                      {
                                        type: 'boolean',
                                        const: 'OTHER',
                                      },
                                    ],
                                    const: 'OTHER',
                                  },
                                },
                                required: ['informant.relation'],
                              },
                            },
                            required: ['$form'],
                          },
                          {
                            type: 'object',
                            not: {
                              type: 'object',
                              properties: {
                                $form: {
                                  type: 'object',
                                  properties: {
                                    'mother.firstname': {
                                      anyOf: [
                                        {
                                          const: 'undefined',
                                        },
                                        {
                                          const: false,
                                        },
                                        {
                                          const: null,
                                        },
                                        {
                                          const: '',
                                        },
                                      ],
                                    },
                                  },
                                  anyOf: [
                                    {
                                      required: ['mother.firstname'],
                                    },
                                    {
                                      not: {
                                        required: ['mother.firstname'],
                                      },
                                    },
                                  ],
                                },
                              },
                              required: ['$form'],
                            },
                            required: [],
                          },
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'father.firstname': {
                                    anyOf: [
                                      {
                                        const: 'undefined',
                                      },
                                      {
                                        const: false,
                                      },
                                      {
                                        const: null,
                                      },
                                      {
                                        const: '',
                                      },
                                    ],
                                  },
                                },
                                anyOf: [
                                  {
                                    required: ['father.firstname'],
                                  },
                                  {
                                    not: {
                                      required: ['father.firstname'],
                                    },
                                  },
                                ],
                              },
                            },
                            required: ['$form'],
                          },
                        ],
                        required: [],
                      },
                    },
                  ],
                  required: true,
                  label: {
                    id: 'v2.event.birth.action.certificate.form.section.requester.label',
                    defaultMessage: 'Requester',
                    description: 'This is the label for the field',
                  },
                  type: 'SELECT',
                  options: [
                    {
                      value: 'INFORMANT',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.informant.other.label',
                        defaultMessage: 'Print and issue to Informant',
                        description: 'This is the label for the field',
                      },
                    },
                    {
                      value: 'MOTHER',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.mother.label',
                        defaultMessage: 'Print and issue to Mother',
                        description: 'This is the label for the field',
                      },
                    },
                    {
                      value: 'SOMEONE_ELSE',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.other.label',
                        defaultMessage: 'Print and issue to someone else',
                        description: 'This is the label for the field',
                      },
                    },
                  ],
                },
                {
                  id: 'collector.requesterId',
                  conditionals: [
                    {
                      type: 'SHOW',
                      conditional: {
                        type: 'object',
                        allOf: [
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'informant.relation': {
                                    oneOf: [
                                      {
                                        type: 'string',
                                        const: 'OTHER',
                                      },
                                      {
                                        type: 'boolean',
                                        const: 'OTHER',
                                      },
                                    ],
                                    const: 'OTHER',
                                  },
                                },
                                required: ['informant.relation'],
                              },
                            },
                            required: ['$form'],
                          },
                          {
                            type: 'object',
                            not: {
                              type: 'object',
                              properties: {
                                $form: {
                                  type: 'object',
                                  properties: {
                                    'father.firstname': {
                                      anyOf: [
                                        {
                                          const: 'undefined',
                                        },
                                        {
                                          const: false,
                                        },
                                        {
                                          const: null,
                                        },
                                        {
                                          const: '',
                                        },
                                      ],
                                    },
                                  },
                                  anyOf: [
                                    {
                                      required: ['father.firstname'],
                                    },
                                    {
                                      not: {
                                        required: ['father.firstname'],
                                      },
                                    },
                                  ],
                                },
                              },
                              required: ['$form'],
                            },
                            required: [],
                          },
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'mother.firstname': {
                                    anyOf: [
                                      {
                                        const: 'undefined',
                                      },
                                      {
                                        const: false,
                                      },
                                      {
                                        const: null,
                                      },
                                      {
                                        const: '',
                                      },
                                    ],
                                  },
                                },
                                anyOf: [
                                  {
                                    required: ['mother.firstname'],
                                  },
                                  {
                                    not: {
                                      required: ['mother.firstname'],
                                    },
                                  },
                                ],
                              },
                            },
                            required: ['$form'],
                          },
                        ],
                        required: [],
                      },
                    },
                  ],
                  required: true,
                  label: {
                    id: 'v2.event.birth.action.certificate.form.section.requester.label',
                    defaultMessage: 'Requester',
                    description: 'This is the label for the field',
                  },
                  type: 'SELECT',
                  options: [
                    {
                      value: 'INFORMANT',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.informant.other.label',
                        defaultMessage: 'Print and issue to Informant',
                        description: 'This is the label for the field',
                      },
                    },
                    {
                      value: 'FATHER',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.father.label',
                        defaultMessage: 'Print and issue to Father',
                        description: 'This is the label for the field',
                      },
                    },
                    {
                      value: 'SOMEONE_ELSE',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.other.label',
                        defaultMessage: 'Print and issue to someone else',
                        description: 'This is the label for the field',
                      },
                    },
                  ],
                },
                {
                  id: 'collector.requesterId',
                  conditionals: [
                    {
                      type: 'SHOW',
                      conditional: {
                        type: 'object',
                        allOf: [
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'informant.relation': {
                                    oneOf: [
                                      {
                                        type: 'string',
                                        const: 'OTHER',
                                      },
                                      {
                                        type: 'boolean',
                                        const: 'OTHER',
                                      },
                                    ],
                                    const: 'OTHER',
                                  },
                                },
                                required: ['informant.relation'],
                              },
                            },
                            required: ['$form'],
                          },
                          {
                            type: 'object',
                            not: {
                              type: 'object',
                              properties: {
                                $form: {
                                  type: 'object',
                                  properties: {
                                    'father.firstname': {
                                      anyOf: [
                                        {
                                          const: 'undefined',
                                        },
                                        {
                                          const: false,
                                        },
                                        {
                                          const: null,
                                        },
                                        {
                                          const: '',
                                        },
                                      ],
                                    },
                                  },
                                  anyOf: [
                                    {
                                      required: ['father.firstname'],
                                    },
                                    {
                                      not: {
                                        required: ['father.firstname'],
                                      },
                                    },
                                  ],
                                },
                              },
                              required: ['$form'],
                            },
                            required: [],
                          },
                          {
                            type: 'object',
                            not: {
                              type: 'object',
                              properties: {
                                $form: {
                                  type: 'object',
                                  properties: {
                                    'mother.firstname': {
                                      anyOf: [
                                        {
                                          const: 'undefined',
                                        },
                                        {
                                          const: false,
                                        },
                                        {
                                          const: null,
                                        },
                                        {
                                          const: '',
                                        },
                                      ],
                                    },
                                  },
                                  anyOf: [
                                    {
                                      required: ['mother.firstname'],
                                    },
                                    {
                                      not: {
                                        required: ['mother.firstname'],
                                      },
                                    },
                                  ],
                                },
                              },
                              required: ['$form'],
                            },
                            required: [],
                          },
                        ],
                        required: [],
                      },
                    },
                  ],
                  required: true,
                  label: {
                    id: 'v2.event.birth.action.certificate.form.section.requester.label',
                    defaultMessage: 'Requester',
                    description: 'This is the label for the field',
                  },
                  type: 'SELECT',
                  options: [
                    {
                      value: 'INFORMANT',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.informant.other.label',
                        defaultMessage: 'Print and issue to Informant',
                        description: 'This is the label for the field',
                      },
                    },
                    {
                      value: 'FATHER',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.father.label',
                        defaultMessage: 'Print and issue to Father',
                        description: 'This is the label for the field',
                      },
                    },
                    {
                      value: 'MOTHER',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.mother.label',
                        defaultMessage: 'Print and issue to Mother',
                        description: 'This is the label for the field',
                      },
                    },
                    {
                      value: 'SOMEONE_ELSE',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.other.label',
                        defaultMessage: 'Print and issue to someone else',
                        description: 'This is the label for the field',
                      },
                    },
                  ],
                },
                {
                  id: 'collector.requesterId',
                  conditionals: [
                    {
                      type: 'SHOW',
                      conditional: {
                        type: 'object',
                        allOf: [
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'informant.relation': {
                                    oneOf: [
                                      {
                                        type: 'string',
                                        const: 'OTHER',
                                      },
                                      {
                                        type: 'boolean',
                                        const: 'OTHER',
                                      },
                                    ],
                                    const: 'OTHER',
                                  },
                                },
                                required: ['informant.relation'],
                              },
                            },
                            required: ['$form'],
                          },
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'father.firstname': {
                                    anyOf: [
                                      {
                                        const: 'undefined',
                                      },
                                      {
                                        const: false,
                                      },
                                      {
                                        const: null,
                                      },
                                      {
                                        const: '',
                                      },
                                    ],
                                  },
                                },
                                anyOf: [
                                  {
                                    required: ['father.firstname'],
                                  },
                                  {
                                    not: {
                                      required: ['father.firstname'],
                                    },
                                  },
                                ],
                              },
                            },
                            required: ['$form'],
                          },
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'mother.firstname': {
                                    anyOf: [
                                      {
                                        const: 'undefined',
                                      },
                                      {
                                        const: false,
                                      },
                                      {
                                        const: null,
                                      },
                                      {
                                        const: '',
                                      },
                                    ],
                                  },
                                },
                                anyOf: [
                                  {
                                    required: ['mother.firstname'],
                                  },
                                  {
                                    not: {
                                      required: ['mother.firstname'],
                                    },
                                  },
                                ],
                              },
                            },
                            required: ['$form'],
                          },
                        ],
                        required: [],
                      },
                    },
                  ],
                  required: true,
                  label: {
                    id: 'v2.event.birth.action.certificate.form.section.requester.label',
                    defaultMessage: 'Requester',
                    description: 'This is the label for the field',
                  },
                  type: 'SELECT',
                  options: [
                    {
                      value: 'INFORMANT',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.informant.other.label',
                        defaultMessage: 'Print and issue to Informant',
                        description: 'This is the label for the field',
                      },
                    },
                    {
                      value: 'SOMEONE_ELSE',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.other.label',
                        defaultMessage: 'Print and issue to someone else',
                        description: 'This is the label for the field',
                      },
                    },
                  ],
                },
                {
                  id: 'collector.requesterId',
                  conditionals: [
                    {
                      type: 'SHOW',
                      conditional: {
                        type: 'object',
                        allOf: [
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'informant.relation': {
                                    oneOf: [
                                      {
                                        type: 'string',
                                        const: 'BROTHER',
                                      },
                                      {
                                        type: 'boolean',
                                        const: 'BROTHER',
                                      },
                                    ],
                                    const: 'BROTHER',
                                  },
                                },
                                required: ['informant.relation'],
                              },
                            },
                            required: ['$form'],
                          },
                          {
                            type: 'object',
                            not: {
                              type: 'object',
                              properties: {
                                $form: {
                                  type: 'object',
                                  properties: {
                                    'mother.firstname': {
                                      anyOf: [
                                        {
                                          const: 'undefined',
                                        },
                                        {
                                          const: false,
                                        },
                                        {
                                          const: null,
                                        },
                                        {
                                          const: '',
                                        },
                                      ],
                                    },
                                  },
                                  anyOf: [
                                    {
                                      required: ['mother.firstname'],
                                    },
                                    {
                                      not: {
                                        required: ['mother.firstname'],
                                      },
                                    },
                                  ],
                                },
                              },
                              required: ['$form'],
                            },
                            required: [],
                          },
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'father.firstname': {
                                    anyOf: [
                                      {
                                        const: 'undefined',
                                      },
                                      {
                                        const: false,
                                      },
                                      {
                                        const: null,
                                      },
                                      {
                                        const: '',
                                      },
                                    ],
                                  },
                                },
                                anyOf: [
                                  {
                                    required: ['father.firstname'],
                                  },
                                  {
                                    not: {
                                      required: ['father.firstname'],
                                    },
                                  },
                                ],
                              },
                            },
                            required: ['$form'],
                          },
                        ],
                        required: [],
                      },
                    },
                  ],
                  required: true,
                  label: {
                    id: 'v2.event.birth.action.certificate.form.section.requester.label',
                    defaultMessage: 'Requester',
                    description: 'This is the label for the field',
                  },
                  type: 'SELECT',
                  options: [
                    {
                      value: 'INFORMANT',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.informant.brother.label',
                        defaultMessage:
                          'Print and issue to Informant (Brother)',
                        description: 'This is the label for the field',
                      },
                    },
                    {
                      value: 'MOTHER',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.mother.label',
                        defaultMessage: 'Print and issue to Mother',
                        description: 'This is the label for the field',
                      },
                    },
                    {
                      value: 'SOMEONE_ELSE',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.other.label',
                        defaultMessage: 'Print and issue to someone else',
                        description: 'This is the label for the field',
                      },
                    },
                  ],
                },
                {
                  id: 'collector.requesterId',
                  conditionals: [
                    {
                      type: 'SHOW',
                      conditional: {
                        type: 'object',
                        allOf: [
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'informant.relation': {
                                    oneOf: [
                                      {
                                        type: 'string',
                                        const: 'BROTHER',
                                      },
                                      {
                                        type: 'boolean',
                                        const: 'BROTHER',
                                      },
                                    ],
                                    const: 'BROTHER',
                                  },
                                },
                                required: ['informant.relation'],
                              },
                            },
                            required: ['$form'],
                          },
                          {
                            type: 'object',
                            not: {
                              type: 'object',
                              properties: {
                                $form: {
                                  type: 'object',
                                  properties: {
                                    'father.firstname': {
                                      anyOf: [
                                        {
                                          const: 'undefined',
                                        },
                                        {
                                          const: false,
                                        },
                                        {
                                          const: null,
                                        },
                                        {
                                          const: '',
                                        },
                                      ],
                                    },
                                  },
                                  anyOf: [
                                    {
                                      required: ['father.firstname'],
                                    },
                                    {
                                      not: {
                                        required: ['father.firstname'],
                                      },
                                    },
                                  ],
                                },
                              },
                              required: ['$form'],
                            },
                            required: [],
                          },
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'mother.firstname': {
                                    anyOf: [
                                      {
                                        const: 'undefined',
                                      },
                                      {
                                        const: false,
                                      },
                                      {
                                        const: null,
                                      },
                                      {
                                        const: '',
                                      },
                                    ],
                                  },
                                },
                                anyOf: [
                                  {
                                    required: ['mother.firstname'],
                                  },
                                  {
                                    not: {
                                      required: ['mother.firstname'],
                                    },
                                  },
                                ],
                              },
                            },
                            required: ['$form'],
                          },
                        ],
                        required: [],
                      },
                    },
                  ],
                  required: true,
                  label: {
                    id: 'v2.event.birth.action.certificate.form.section.requester.label',
                    defaultMessage: 'Requester',
                    description: 'This is the label for the field',
                  },
                  type: 'SELECT',
                  options: [
                    {
                      value: 'INFORMANT',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.informant.brother.label',
                        defaultMessage:
                          'Print and issue to Informant (Brother)',
                        description: 'This is the label for the field',
                      },
                    },
                    {
                      value: 'FATHER',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.father.label',
                        defaultMessage: 'Print and issue to Father',
                        description: 'This is the label for the field',
                      },
                    },
                    {
                      value: 'SOMEONE_ELSE',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.other.label',
                        defaultMessage: 'Print and issue to someone else',
                        description: 'This is the label for the field',
                      },
                    },
                  ],
                },
                {
                  id: 'collector.requesterId',
                  conditionals: [
                    {
                      type: 'SHOW',
                      conditional: {
                        type: 'object',
                        allOf: [
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'informant.relation': {
                                    oneOf: [
                                      {
                                        type: 'string',
                                        const: 'BROTHER',
                                      },
                                      {
                                        type: 'boolean',
                                        const: 'BROTHER',
                                      },
                                    ],
                                    const: 'BROTHER',
                                  },
                                },
                                required: ['informant.relation'],
                              },
                            },
                            required: ['$form'],
                          },
                          {
                            type: 'object',
                            not: {
                              type: 'object',
                              properties: {
                                $form: {
                                  type: 'object',
                                  properties: {
                                    'father.firstname': {
                                      anyOf: [
                                        {
                                          const: 'undefined',
                                        },
                                        {
                                          const: false,
                                        },
                                        {
                                          const: null,
                                        },
                                        {
                                          const: '',
                                        },
                                      ],
                                    },
                                  },
                                  anyOf: [
                                    {
                                      required: ['father.firstname'],
                                    },
                                    {
                                      not: {
                                        required: ['father.firstname'],
                                      },
                                    },
                                  ],
                                },
                              },
                              required: ['$form'],
                            },
                            required: [],
                          },
                          {
                            type: 'object',
                            not: {
                              type: 'object',
                              properties: {
                                $form: {
                                  type: 'object',
                                  properties: {
                                    'mother.firstname': {
                                      anyOf: [
                                        {
                                          const: 'undefined',
                                        },
                                        {
                                          const: false,
                                        },
                                        {
                                          const: null,
                                        },
                                        {
                                          const: '',
                                        },
                                      ],
                                    },
                                  },
                                  anyOf: [
                                    {
                                      required: ['mother.firstname'],
                                    },
                                    {
                                      not: {
                                        required: ['mother.firstname'],
                                      },
                                    },
                                  ],
                                },
                              },
                              required: ['$form'],
                            },
                            required: [],
                          },
                        ],
                        required: [],
                      },
                    },
                  ],
                  required: true,
                  label: {
                    id: 'v2.event.birth.action.certificate.form.section.requester.label',
                    defaultMessage: 'Requester',
                    description: 'This is the label for the field',
                  },
                  type: 'SELECT',
                  options: [
                    {
                      value: 'INFORMANT',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.informant.brother.label',
                        defaultMessage:
                          'Print and issue to Informant (Brother)',
                        description: 'This is the label for the field',
                      },
                    },
                    {
                      value: 'FATHER',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.father.label',
                        defaultMessage: 'Print and issue to Father',
                        description: 'This is the label for the field',
                      },
                    },
                    {
                      value: 'MOTHER',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.mother.label',
                        defaultMessage: 'Print and issue to Mother',
                        description: 'This is the label for the field',
                      },
                    },
                    {
                      value: 'SOMEONE_ELSE',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.other.label',
                        defaultMessage: 'Print and issue to someone else',
                        description: 'This is the label for the field',
                      },
                    },
                  ],
                },
                {
                  id: 'collector.requesterId',
                  conditionals: [
                    {
                      type: 'SHOW',
                      conditional: {
                        type: 'object',
                        allOf: [
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'informant.relation': {
                                    oneOf: [
                                      {
                                        type: 'string',
                                        const: 'BROTHER',
                                      },
                                      {
                                        type: 'boolean',
                                        const: 'BROTHER',
                                      },
                                    ],
                                    const: 'BROTHER',
                                  },
                                },
                                required: ['informant.relation'],
                              },
                            },
                            required: ['$form'],
                          },
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'father.firstname': {
                                    anyOf: [
                                      {
                                        const: 'undefined',
                                      },
                                      {
                                        const: false,
                                      },
                                      {
                                        const: null,
                                      },
                                      {
                                        const: '',
                                      },
                                    ],
                                  },
                                },
                                anyOf: [
                                  {
                                    required: ['father.firstname'],
                                  },
                                  {
                                    not: {
                                      required: ['father.firstname'],
                                    },
                                  },
                                ],
                              },
                            },
                            required: ['$form'],
                          },
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'mother.firstname': {
                                    anyOf: [
                                      {
                                        const: 'undefined',
                                      },
                                      {
                                        const: false,
                                      },
                                      {
                                        const: null,
                                      },
                                      {
                                        const: '',
                                      },
                                    ],
                                  },
                                },
                                anyOf: [
                                  {
                                    required: ['mother.firstname'],
                                  },
                                  {
                                    not: {
                                      required: ['mother.firstname'],
                                    },
                                  },
                                ],
                              },
                            },
                            required: ['$form'],
                          },
                        ],
                        required: [],
                      },
                    },
                  ],
                  required: true,
                  label: {
                    id: 'v2.event.birth.action.certificate.form.section.requester.label',
                    defaultMessage: 'Requester',
                    description: 'This is the label for the field',
                  },
                  type: 'SELECT',
                  options: [
                    {
                      value: 'INFORMANT',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.informant.brother.label',
                        defaultMessage:
                          'Print and issue to Informant (Brother)',
                        description: 'This is the label for the field',
                      },
                    },
                    {
                      value: 'SOMEONE_ELSE',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.other.label',
                        defaultMessage: 'Print and issue to someone else',
                        description: 'This is the label for the field',
                      },
                    },
                  ],
                },
                {
                  id: 'collector.requesterId',
                  conditionals: [
                    {
                      type: 'SHOW',
                      conditional: {
                        type: 'object',
                        allOf: [
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'informant.relation': {
                                    oneOf: [
                                      {
                                        type: 'string',
                                        const: 'GRANDFATHER',
                                      },
                                      {
                                        type: 'boolean',
                                        const: 'GRANDFATHER',
                                      },
                                    ],
                                    const: 'GRANDFATHER',
                                  },
                                },
                                required: ['informant.relation'],
                              },
                            },
                            required: ['$form'],
                          },
                          {
                            type: 'object',
                            not: {
                              type: 'object',
                              properties: {
                                $form: {
                                  type: 'object',
                                  properties: {
                                    'mother.firstname': {
                                      anyOf: [
                                        {
                                          const: 'undefined',
                                        },
                                        {
                                          const: false,
                                        },
                                        {
                                          const: null,
                                        },
                                        {
                                          const: '',
                                        },
                                      ],
                                    },
                                  },
                                  anyOf: [
                                    {
                                      required: ['mother.firstname'],
                                    },
                                    {
                                      not: {
                                        required: ['mother.firstname'],
                                      },
                                    },
                                  ],
                                },
                              },
                              required: ['$form'],
                            },
                            required: [],
                          },
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'father.firstname': {
                                    anyOf: [
                                      {
                                        const: 'undefined',
                                      },
                                      {
                                        const: false,
                                      },
                                      {
                                        const: null,
                                      },
                                      {
                                        const: '',
                                      },
                                    ],
                                  },
                                },
                                anyOf: [
                                  {
                                    required: ['father.firstname'],
                                  },
                                  {
                                    not: {
                                      required: ['father.firstname'],
                                    },
                                  },
                                ],
                              },
                            },
                            required: ['$form'],
                          },
                        ],
                        required: [],
                      },
                    },
                  ],
                  required: true,
                  label: {
                    id: 'v2.event.birth.action.certificate.form.section.requester.label',
                    defaultMessage: 'Requester',
                    description: 'This is the label for the field',
                  },
                  type: 'SELECT',
                  options: [
                    {
                      value: 'INFORMANT',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.informant.grandfather.label',
                        defaultMessage:
                          'Print and issue to Informant (Grandfather)',
                        description: 'This is the label for the field',
                      },
                    },
                    {
                      value: 'MOTHER',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.mother.label',
                        defaultMessage: 'Print and issue to Mother',
                        description: 'This is the label for the field',
                      },
                    },
                    {
                      value: 'SOMEONE_ELSE',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.other.label',
                        defaultMessage: 'Print and issue to someone else',
                        description: 'This is the label for the field',
                      },
                    },
                  ],
                },
                {
                  id: 'collector.requesterId',
                  conditionals: [
                    {
                      type: 'SHOW',
                      conditional: {
                        type: 'object',
                        allOf: [
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'informant.relation': {
                                    oneOf: [
                                      {
                                        type: 'string',
                                        const: 'GRANDFATHER',
                                      },
                                      {
                                        type: 'boolean',
                                        const: 'GRANDFATHER',
                                      },
                                    ],
                                    const: 'GRANDFATHER',
                                  },
                                },
                                required: ['informant.relation'],
                              },
                            },
                            required: ['$form'],
                          },
                          {
                            type: 'object',
                            not: {
                              type: 'object',
                              properties: {
                                $form: {
                                  type: 'object',
                                  properties: {
                                    'father.firstname': {
                                      anyOf: [
                                        {
                                          const: 'undefined',
                                        },
                                        {
                                          const: false,
                                        },
                                        {
                                          const: null,
                                        },
                                        {
                                          const: '',
                                        },
                                      ],
                                    },
                                  },
                                  anyOf: [
                                    {
                                      required: ['father.firstname'],
                                    },
                                    {
                                      not: {
                                        required: ['father.firstname'],
                                      },
                                    },
                                  ],
                                },
                              },
                              required: ['$form'],
                            },
                            required: [],
                          },
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'mother.firstname': {
                                    anyOf: [
                                      {
                                        const: 'undefined',
                                      },
                                      {
                                        const: false,
                                      },
                                      {
                                        const: null,
                                      },
                                      {
                                        const: '',
                                      },
                                    ],
                                  },
                                },
                                anyOf: [
                                  {
                                    required: ['mother.firstname'],
                                  },
                                  {
                                    not: {
                                      required: ['mother.firstname'],
                                    },
                                  },
                                ],
                              },
                            },
                            required: ['$form'],
                          },
                        ],
                        required: [],
                      },
                    },
                  ],
                  required: true,
                  label: {
                    id: 'v2.event.birth.action.certificate.form.section.requester.label',
                    defaultMessage: 'Requester',
                    description: 'This is the label for the field',
                  },
                  type: 'SELECT',
                  options: [
                    {
                      value: 'INFORMANT',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.informant.grandfather.label',
                        defaultMessage:
                          'Print and issue to Informant (Grandfather)',
                        description: 'This is the label for the field',
                      },
                    },
                    {
                      value: 'FATHER',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.father.label',
                        defaultMessage: 'Print and issue to Father',
                        description: 'This is the label for the field',
                      },
                    },
                    {
                      value: 'SOMEONE_ELSE',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.other.label',
                        defaultMessage: 'Print and issue to someone else',
                        description: 'This is the label for the field',
                      },
                    },
                  ],
                },
                {
                  id: 'collector.requesterId',
                  conditionals: [
                    {
                      type: 'SHOW',
                      conditional: {
                        type: 'object',
                        allOf: [
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'informant.relation': {
                                    oneOf: [
                                      {
                                        type: 'string',
                                        const: 'GRANDFATHER',
                                      },
                                      {
                                        type: 'boolean',
                                        const: 'GRANDFATHER',
                                      },
                                    ],
                                    const: 'GRANDFATHER',
                                  },
                                },
                                required: ['informant.relation'],
                              },
                            },
                            required: ['$form'],
                          },
                          {
                            type: 'object',
                            not: {
                              type: 'object',
                              properties: {
                                $form: {
                                  type: 'object',
                                  properties: {
                                    'father.firstname': {
                                      anyOf: [
                                        {
                                          const: 'undefined',
                                        },
                                        {
                                          const: false,
                                        },
                                        {
                                          const: null,
                                        },
                                        {
                                          const: '',
                                        },
                                      ],
                                    },
                                  },
                                  anyOf: [
                                    {
                                      required: ['father.firstname'],
                                    },
                                    {
                                      not: {
                                        required: ['father.firstname'],
                                      },
                                    },
                                  ],
                                },
                              },
                              required: ['$form'],
                            },
                            required: [],
                          },
                          {
                            type: 'object',
                            not: {
                              type: 'object',
                              properties: {
                                $form: {
                                  type: 'object',
                                  properties: {
                                    'mother.firstname': {
                                      anyOf: [
                                        {
                                          const: 'undefined',
                                        },
                                        {
                                          const: false,
                                        },
                                        {
                                          const: null,
                                        },
                                        {
                                          const: '',
                                        },
                                      ],
                                    },
                                  },
                                  anyOf: [
                                    {
                                      required: ['mother.firstname'],
                                    },
                                    {
                                      not: {
                                        required: ['mother.firstname'],
                                      },
                                    },
                                  ],
                                },
                              },
                              required: ['$form'],
                            },
                            required: [],
                          },
                        ],
                        required: [],
                      },
                    },
                  ],
                  required: true,
                  label: {
                    id: 'v2.event.birth.action.certificate.form.section.requester.label',
                    defaultMessage: 'Requester',
                    description: 'This is the label for the field',
                  },
                  type: 'SELECT',
                  options: [
                    {
                      value: 'INFORMANT',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.informant.grandfather.label',
                        defaultMessage:
                          'Print and issue to Informant (Grandfather)',
                        description: 'This is the label for the field',
                      },
                    },
                    {
                      value: 'FATHER',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.father.label',
                        defaultMessage: 'Print and issue to Father',
                        description: 'This is the label for the field',
                      },
                    },
                    {
                      value: 'MOTHER',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.mother.label',
                        defaultMessage: 'Print and issue to Mother',
                        description: 'This is the label for the field',
                      },
                    },
                    {
                      value: 'SOMEONE_ELSE',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.other.label',
                        defaultMessage: 'Print and issue to someone else',
                        description: 'This is the label for the field',
                      },
                    },
                  ],
                },
                {
                  id: 'collector.requesterId',
                  conditionals: [
                    {
                      type: 'SHOW',
                      conditional: {
                        type: 'object',
                        allOf: [
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'informant.relation': {
                                    oneOf: [
                                      {
                                        type: 'string',
                                        const: 'GRANDFATHER',
                                      },
                                      {
                                        type: 'boolean',
                                        const: 'GRANDFATHER',
                                      },
                                    ],
                                    const: 'GRANDFATHER',
                                  },
                                },
                                required: ['informant.relation'],
                              },
                            },
                            required: ['$form'],
                          },
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'father.firstname': {
                                    anyOf: [
                                      {
                                        const: 'undefined',
                                      },
                                      {
                                        const: false,
                                      },
                                      {
                                        const: null,
                                      },
                                      {
                                        const: '',
                                      },
                                    ],
                                  },
                                },
                                anyOf: [
                                  {
                                    required: ['father.firstname'],
                                  },
                                  {
                                    not: {
                                      required: ['father.firstname'],
                                    },
                                  },
                                ],
                              },
                            },
                            required: ['$form'],
                          },
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'mother.firstname': {
                                    anyOf: [
                                      {
                                        const: 'undefined',
                                      },
                                      {
                                        const: false,
                                      },
                                      {
                                        const: null,
                                      },
                                      {
                                        const: '',
                                      },
                                    ],
                                  },
                                },
                                anyOf: [
                                  {
                                    required: ['mother.firstname'],
                                  },
                                  {
                                    not: {
                                      required: ['mother.firstname'],
                                    },
                                  },
                                ],
                              },
                            },
                            required: ['$form'],
                          },
                        ],
                        required: [],
                      },
                    },
                  ],
                  required: true,
                  label: {
                    id: 'v2.event.birth.action.certificate.form.section.requester.label',
                    defaultMessage: 'Requester',
                    description: 'This is the label for the field',
                  },
                  type: 'SELECT',
                  options: [
                    {
                      value: 'INFORMANT',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.informant.grandfather.label',
                        defaultMessage:
                          'Print and issue to Informant (Grandfather)',
                        description: 'This is the label for the field',
                      },
                    },
                    {
                      value: 'SOMEONE_ELSE',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.other.label',
                        defaultMessage: 'Print and issue to someone else',
                        description: 'This is the label for the field',
                      },
                    },
                  ],
                },
                {
                  id: 'collector.requesterId',
                  conditionals: [
                    {
                      type: 'SHOW',
                      conditional: {
                        type: 'object',
                        allOf: [
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'informant.relation': {
                                    oneOf: [
                                      {
                                        type: 'string',
                                        const: 'GRANDMOTHER',
                                      },
                                      {
                                        type: 'boolean',
                                        const: 'GRANDMOTHER',
                                      },
                                    ],
                                    const: 'GRANDMOTHER',
                                  },
                                },
                                required: ['informant.relation'],
                              },
                            },
                            required: ['$form'],
                          },
                          {
                            type: 'object',
                            not: {
                              type: 'object',
                              properties: {
                                $form: {
                                  type: 'object',
                                  properties: {
                                    'mother.firstname': {
                                      anyOf: [
                                        {
                                          const: 'undefined',
                                        },
                                        {
                                          const: false,
                                        },
                                        {
                                          const: null,
                                        },
                                        {
                                          const: '',
                                        },
                                      ],
                                    },
                                  },
                                  anyOf: [
                                    {
                                      required: ['mother.firstname'],
                                    },
                                    {
                                      not: {
                                        required: ['mother.firstname'],
                                      },
                                    },
                                  ],
                                },
                              },
                              required: ['$form'],
                            },
                            required: [],
                          },
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'father.firstname': {
                                    anyOf: [
                                      {
                                        const: 'undefined',
                                      },
                                      {
                                        const: false,
                                      },
                                      {
                                        const: null,
                                      },
                                      {
                                        const: '',
                                      },
                                    ],
                                  },
                                },
                                anyOf: [
                                  {
                                    required: ['father.firstname'],
                                  },
                                  {
                                    not: {
                                      required: ['father.firstname'],
                                    },
                                  },
                                ],
                              },
                            },
                            required: ['$form'],
                          },
                        ],
                        required: [],
                      },
                    },
                  ],
                  required: true,
                  label: {
                    id: 'v2.event.birth.action.certificate.form.section.requester.label',
                    defaultMessage: 'Requester',
                    description: 'This is the label for the field',
                  },
                  type: 'SELECT',
                  options: [
                    {
                      value: 'INFORMANT',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.informant.grandmother.label',
                        defaultMessage:
                          'Print and issue to Informant (Grandmother)',
                        description: 'This is the label for the field',
                      },
                    },
                    {
                      value: 'MOTHER',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.mother.label',
                        defaultMessage: 'Print and issue to Mother',
                        description: 'This is the label for the field',
                      },
                    },
                    {
                      value: 'SOMEONE_ELSE',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.other.label',
                        defaultMessage: 'Print and issue to someone else',
                        description: 'This is the label for the field',
                      },
                    },
                  ],
                },
                {
                  id: 'collector.requesterId',
                  conditionals: [
                    {
                      type: 'SHOW',
                      conditional: {
                        type: 'object',
                        allOf: [
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'informant.relation': {
                                    oneOf: [
                                      {
                                        type: 'string',
                                        const: 'GRANDMOTHER',
                                      },
                                      {
                                        type: 'boolean',
                                        const: 'GRANDMOTHER',
                                      },
                                    ],
                                    const: 'GRANDMOTHER',
                                  },
                                },
                                required: ['informant.relation'],
                              },
                            },
                            required: ['$form'],
                          },
                          {
                            type: 'object',
                            not: {
                              type: 'object',
                              properties: {
                                $form: {
                                  type: 'object',
                                  properties: {
                                    'father.firstname': {
                                      anyOf: [
                                        {
                                          const: 'undefined',
                                        },
                                        {
                                          const: false,
                                        },
                                        {
                                          const: null,
                                        },
                                        {
                                          const: '',
                                        },
                                      ],
                                    },
                                  },
                                  anyOf: [
                                    {
                                      required: ['father.firstname'],
                                    },
                                    {
                                      not: {
                                        required: ['father.firstname'],
                                      },
                                    },
                                  ],
                                },
                              },
                              required: ['$form'],
                            },
                            required: [],
                          },
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'mother.firstname': {
                                    anyOf: [
                                      {
                                        const: 'undefined',
                                      },
                                      {
                                        const: false,
                                      },
                                      {
                                        const: null,
                                      },
                                      {
                                        const: '',
                                      },
                                    ],
                                  },
                                },
                                anyOf: [
                                  {
                                    required: ['mother.firstname'],
                                  },
                                  {
                                    not: {
                                      required: ['mother.firstname'],
                                    },
                                  },
                                ],
                              },
                            },
                            required: ['$form'],
                          },
                        ],
                        required: [],
                      },
                    },
                  ],
                  required: true,
                  label: {
                    id: 'v2.event.birth.action.certificate.form.section.requester.label',
                    defaultMessage: 'Requester',
                    description: 'This is the label for the field',
                  },
                  type: 'SELECT',
                  options: [
                    {
                      value: 'INFORMANT',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.informant.grandmother.label',
                        defaultMessage:
                          'Print and issue to Informant (Grandmother)',
                        description: 'This is the label for the field',
                      },
                    },
                    {
                      value: 'FATHER',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.father.label',
                        defaultMessage: 'Print and issue to Father',
                        description: 'This is the label for the field',
                      },
                    },
                    {
                      value: 'SOMEONE_ELSE',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.other.label',
                        defaultMessage: 'Print and issue to someone else',
                        description: 'This is the label for the field',
                      },
                    },
                  ],
                },
                {
                  id: 'collector.requesterId',
                  conditionals: [
                    {
                      type: 'SHOW',
                      conditional: {
                        type: 'object',
                        allOf: [
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'informant.relation': {
                                    oneOf: [
                                      {
                                        type: 'string',
                                        const: 'GRANDMOTHER',
                                      },
                                      {
                                        type: 'boolean',
                                        const: 'GRANDMOTHER',
                                      },
                                    ],
                                    const: 'GRANDMOTHER',
                                  },
                                },
                                required: ['informant.relation'],
                              },
                            },
                            required: ['$form'],
                          },
                          {
                            type: 'object',
                            not: {
                              type: 'object',
                              properties: {
                                $form: {
                                  type: 'object',
                                  properties: {
                                    'father.firstname': {
                                      anyOf: [
                                        {
                                          const: 'undefined',
                                        },
                                        {
                                          const: false,
                                        },
                                        {
                                          const: null,
                                        },
                                        {
                                          const: '',
                                        },
                                      ],
                                    },
                                  },
                                  anyOf: [
                                    {
                                      required: ['father.firstname'],
                                    },
                                    {
                                      not: {
                                        required: ['father.firstname'],
                                      },
                                    },
                                  ],
                                },
                              },
                              required: ['$form'],
                            },
                            required: [],
                          },
                          {
                            type: 'object',
                            not: {
                              type: 'object',
                              properties: {
                                $form: {
                                  type: 'object',
                                  properties: {
                                    'mother.firstname': {
                                      anyOf: [
                                        {
                                          const: 'undefined',
                                        },
                                        {
                                          const: false,
                                        },
                                        {
                                          const: null,
                                        },
                                        {
                                          const: '',
                                        },
                                      ],
                                    },
                                  },
                                  anyOf: [
                                    {
                                      required: ['mother.firstname'],
                                    },
                                    {
                                      not: {
                                        required: ['mother.firstname'],
                                      },
                                    },
                                  ],
                                },
                              },
                              required: ['$form'],
                            },
                            required: [],
                          },
                        ],
                        required: [],
                      },
                    },
                  ],
                  required: true,
                  label: {
                    id: 'v2.event.birth.action.certificate.form.section.requester.label',
                    defaultMessage: 'Requester',
                    description: 'This is the label for the field',
                  },
                  type: 'SELECT',
                  options: [
                    {
                      value: 'INFORMANT',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.informant.grandmother.label',
                        defaultMessage:
                          'Print and issue to Informant (Grandmother)',
                        description: 'This is the label for the field',
                      },
                    },
                    {
                      value: 'FATHER',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.father.label',
                        defaultMessage: 'Print and issue to Father',
                        description: 'This is the label for the field',
                      },
                    },
                    {
                      value: 'MOTHER',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.mother.label',
                        defaultMessage: 'Print and issue to Mother',
                        description: 'This is the label for the field',
                      },
                    },
                    {
                      value: 'SOMEONE_ELSE',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.other.label',
                        defaultMessage: 'Print and issue to someone else',
                        description: 'This is the label for the field',
                      },
                    },
                  ],
                },
                {
                  id: 'collector.requesterId',
                  conditionals: [
                    {
                      type: 'SHOW',
                      conditional: {
                        type: 'object',
                        allOf: [
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'informant.relation': {
                                    oneOf: [
                                      {
                                        type: 'string',
                                        const: 'GRANDMOTHER',
                                      },
                                      {
                                        type: 'boolean',
                                        const: 'GRANDMOTHER',
                                      },
                                    ],
                                    const: 'GRANDMOTHER',
                                  },
                                },
                                required: ['informant.relation'],
                              },
                            },
                            required: ['$form'],
                          },
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'father.firstname': {
                                    anyOf: [
                                      {
                                        const: 'undefined',
                                      },
                                      {
                                        const: false,
                                      },
                                      {
                                        const: null,
                                      },
                                      {
                                        const: '',
                                      },
                                    ],
                                  },
                                },
                                anyOf: [
                                  {
                                    required: ['father.firstname'],
                                  },
                                  {
                                    not: {
                                      required: ['father.firstname'],
                                    },
                                  },
                                ],
                              },
                            },
                            required: ['$form'],
                          },
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'mother.firstname': {
                                    anyOf: [
                                      {
                                        const: 'undefined',
                                      },
                                      {
                                        const: false,
                                      },
                                      {
                                        const: null,
                                      },
                                      {
                                        const: '',
                                      },
                                    ],
                                  },
                                },
                                anyOf: [
                                  {
                                    required: ['mother.firstname'],
                                  },
                                  {
                                    not: {
                                      required: ['mother.firstname'],
                                    },
                                  },
                                ],
                              },
                            },
                            required: ['$form'],
                          },
                        ],
                        required: [],
                      },
                    },
                  ],
                  required: true,
                  label: {
                    id: 'v2.event.birth.action.certificate.form.section.requester.label',
                    defaultMessage: 'Requester',
                    description: 'This is the label for the field',
                  },
                  type: 'SELECT',
                  options: [
                    {
                      value: 'INFORMANT',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.informant.grandmother.label',
                        defaultMessage:
                          'Print and issue to Informant (Grandmother)',
                        description: 'This is the label for the field',
                      },
                    },
                    {
                      value: 'SOMEONE_ELSE',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.other.label',
                        defaultMessage: 'Print and issue to someone else',
                        description: 'This is the label for the field',
                      },
                    },
                  ],
                },
                {
                  id: 'collector.requesterId',
                  conditionals: [
                    {
                      type: 'SHOW',
                      conditional: {
                        type: 'object',
                        allOf: [
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'informant.relation': {
                                    oneOf: [
                                      {
                                        type: 'string',
                                        const: 'SISTER',
                                      },
                                      {
                                        type: 'boolean',
                                        const: 'SISTER',
                                      },
                                    ],
                                    const: 'SISTER',
                                  },
                                },
                                required: ['informant.relation'],
                              },
                            },
                            required: ['$form'],
                          },
                          {
                            type: 'object',
                            not: {
                              type: 'object',
                              properties: {
                                $form: {
                                  type: 'object',
                                  properties: {
                                    'mother.firstname': {
                                      anyOf: [
                                        {
                                          const: 'undefined',
                                        },
                                        {
                                          const: false,
                                        },
                                        {
                                          const: null,
                                        },
                                        {
                                          const: '',
                                        },
                                      ],
                                    },
                                  },
                                  anyOf: [
                                    {
                                      required: ['mother.firstname'],
                                    },
                                    {
                                      not: {
                                        required: ['mother.firstname'],
                                      },
                                    },
                                  ],
                                },
                              },
                              required: ['$form'],
                            },
                            required: [],
                          },
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'father.firstname': {
                                    anyOf: [
                                      {
                                        const: 'undefined',
                                      },
                                      {
                                        const: false,
                                      },
                                      {
                                        const: null,
                                      },
                                      {
                                        const: '',
                                      },
                                    ],
                                  },
                                },
                                anyOf: [
                                  {
                                    required: ['father.firstname'],
                                  },
                                  {
                                    not: {
                                      required: ['father.firstname'],
                                    },
                                  },
                                ],
                              },
                            },
                            required: ['$form'],
                          },
                        ],
                        required: [],
                      },
                    },
                  ],
                  required: true,
                  label: {
                    id: 'v2.event.birth.action.certificate.form.section.requester.label',
                    defaultMessage: 'Requester',
                    description: 'This is the label for the field',
                  },
                  type: 'SELECT',
                  options: [
                    {
                      value: 'INFORMANT',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.informant.sister.label',
                        defaultMessage: 'Print and issue to Informant (Sister)',
                        description: 'This is the label for the field',
                      },
                    },
                    {
                      value: 'MOTHER',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.mother.label',
                        defaultMessage: 'Print and issue to Mother',
                        description: 'This is the label for the field',
                      },
                    },
                    {
                      value: 'SOMEONE_ELSE',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.other.label',
                        defaultMessage: 'Print and issue to someone else',
                        description: 'This is the label for the field',
                      },
                    },
                  ],
                },
                {
                  id: 'collector.requesterId',
                  conditionals: [
                    {
                      type: 'SHOW',
                      conditional: {
                        type: 'object',
                        allOf: [
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'informant.relation': {
                                    oneOf: [
                                      {
                                        type: 'string',
                                        const: 'SISTER',
                                      },
                                      {
                                        type: 'boolean',
                                        const: 'SISTER',
                                      },
                                    ],
                                    const: 'SISTER',
                                  },
                                },
                                required: ['informant.relation'],
                              },
                            },
                            required: ['$form'],
                          },
                          {
                            type: 'object',
                            not: {
                              type: 'object',
                              properties: {
                                $form: {
                                  type: 'object',
                                  properties: {
                                    'father.firstname': {
                                      anyOf: [
                                        {
                                          const: 'undefined',
                                        },
                                        {
                                          const: false,
                                        },
                                        {
                                          const: null,
                                        },
                                        {
                                          const: '',
                                        },
                                      ],
                                    },
                                  },
                                  anyOf: [
                                    {
                                      required: ['father.firstname'],
                                    },
                                    {
                                      not: {
                                        required: ['father.firstname'],
                                      },
                                    },
                                  ],
                                },
                              },
                              required: ['$form'],
                            },
                            required: [],
                          },
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'mother.firstname': {
                                    anyOf: [
                                      {
                                        const: 'undefined',
                                      },
                                      {
                                        const: false,
                                      },
                                      {
                                        const: null,
                                      },
                                      {
                                        const: '',
                                      },
                                    ],
                                  },
                                },
                                anyOf: [
                                  {
                                    required: ['mother.firstname'],
                                  },
                                  {
                                    not: {
                                      required: ['mother.firstname'],
                                    },
                                  },
                                ],
                              },
                            },
                            required: ['$form'],
                          },
                        ],
                        required: [],
                      },
                    },
                  ],
                  required: true,
                  label: {
                    id: 'v2.event.birth.action.certificate.form.section.requester.label',
                    defaultMessage: 'Requester',
                    description: 'This is the label for the field',
                  },
                  type: 'SELECT',
                  options: [
                    {
                      value: 'INFORMANT',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.informant.sister.label',
                        defaultMessage: 'Print and issue to Informant (Sister)',
                        description: 'This is the label for the field',
                      },
                    },
                    {
                      value: 'FATHER',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.father.label',
                        defaultMessage: 'Print and issue to Father',
                        description: 'This is the label for the field',
                      },
                    },
                    {
                      value: 'SOMEONE_ELSE',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.other.label',
                        defaultMessage: 'Print and issue to someone else',
                        description: 'This is the label for the field',
                      },
                    },
                  ],
                },
                {
                  id: 'collector.requesterId',
                  conditionals: [
                    {
                      type: 'SHOW',
                      conditional: {
                        type: 'object',
                        allOf: [
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'informant.relation': {
                                    oneOf: [
                                      {
                                        type: 'string',
                                        const: 'SISTER',
                                      },
                                      {
                                        type: 'boolean',
                                        const: 'SISTER',
                                      },
                                    ],
                                    const: 'SISTER',
                                  },
                                },
                                required: ['informant.relation'],
                              },
                            },
                            required: ['$form'],
                          },
                          {
                            type: 'object',
                            not: {
                              type: 'object',
                              properties: {
                                $form: {
                                  type: 'object',
                                  properties: {
                                    'father.firstname': {
                                      anyOf: [
                                        {
                                          const: 'undefined',
                                        },
                                        {
                                          const: false,
                                        },
                                        {
                                          const: null,
                                        },
                                        {
                                          const: '',
                                        },
                                      ],
                                    },
                                  },
                                  anyOf: [
                                    {
                                      required: ['father.firstname'],
                                    },
                                    {
                                      not: {
                                        required: ['father.firstname'],
                                      },
                                    },
                                  ],
                                },
                              },
                              required: ['$form'],
                            },
                            required: [],
                          },
                          {
                            type: 'object',
                            not: {
                              type: 'object',
                              properties: {
                                $form: {
                                  type: 'object',
                                  properties: {
                                    'mother.firstname': {
                                      anyOf: [
                                        {
                                          const: 'undefined',
                                        },
                                        {
                                          const: false,
                                        },
                                        {
                                          const: null,
                                        },
                                        {
                                          const: '',
                                        },
                                      ],
                                    },
                                  },
                                  anyOf: [
                                    {
                                      required: ['mother.firstname'],
                                    },
                                    {
                                      not: {
                                        required: ['mother.firstname'],
                                      },
                                    },
                                  ],
                                },
                              },
                              required: ['$form'],
                            },
                            required: [],
                          },
                        ],
                        required: [],
                      },
                    },
                  ],
                  required: true,
                  label: {
                    id: 'v2.event.birth.action.certificate.form.section.requester.label',
                    defaultMessage: 'Requester',
                    description: 'This is the label for the field',
                  },
                  type: 'SELECT',
                  options: [
                    {
                      value: 'INFORMANT',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.informant.sister.label',
                        defaultMessage: 'Print and issue to Informant (Sister)',
                        description: 'This is the label for the field',
                      },
                    },
                    {
                      value: 'FATHER',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.father.label',
                        defaultMessage: 'Print and issue to Father',
                        description: 'This is the label for the field',
                      },
                    },
                    {
                      value: 'MOTHER',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.mother.label',
                        defaultMessage: 'Print and issue to Mother',
                        description: 'This is the label for the field',
                      },
                    },
                    {
                      value: 'SOMEONE_ELSE',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.other.label',
                        defaultMessage: 'Print and issue to someone else',
                        description: 'This is the label for the field',
                      },
                    },
                  ],
                },
                {
                  id: 'collector.requesterId',
                  conditionals: [
                    {
                      type: 'SHOW',
                      conditional: {
                        type: 'object',
                        allOf: [
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'informant.relation': {
                                    oneOf: [
                                      {
                                        type: 'string',
                                        const: 'SISTER',
                                      },
                                      {
                                        type: 'boolean',
                                        const: 'SISTER',
                                      },
                                    ],
                                    const: 'SISTER',
                                  },
                                },
                                required: ['informant.relation'],
                              },
                            },
                            required: ['$form'],
                          },
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'father.firstname': {
                                    anyOf: [
                                      {
                                        const: 'undefined',
                                      },
                                      {
                                        const: false,
                                      },
                                      {
                                        const: null,
                                      },
                                      {
                                        const: '',
                                      },
                                    ],
                                  },
                                },
                                anyOf: [
                                  {
                                    required: ['father.firstname'],
                                  },
                                  {
                                    not: {
                                      required: ['father.firstname'],
                                    },
                                  },
                                ],
                              },
                            },
                            required: ['$form'],
                          },
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'mother.firstname': {
                                    anyOf: [
                                      {
                                        const: 'undefined',
                                      },
                                      {
                                        const: false,
                                      },
                                      {
                                        const: null,
                                      },
                                      {
                                        const: '',
                                      },
                                    ],
                                  },
                                },
                                anyOf: [
                                  {
                                    required: ['mother.firstname'],
                                  },
                                  {
                                    not: {
                                      required: ['mother.firstname'],
                                    },
                                  },
                                ],
                              },
                            },
                            required: ['$form'],
                          },
                        ],
                        required: [],
                      },
                    },
                  ],
                  required: true,
                  label: {
                    id: 'v2.event.birth.action.certificate.form.section.requester.label',
                    defaultMessage: 'Requester',
                    description: 'This is the label for the field',
                  },
                  type: 'SELECT',
                  options: [
                    {
                      value: 'INFORMANT',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.informant.sister.label',
                        defaultMessage: 'Print and issue to Informant (Sister)',
                        description: 'This is the label for the field',
                      },
                    },
                    {
                      value: 'SOMEONE_ELSE',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.other.label',
                        defaultMessage: 'Print and issue to someone else',
                        description: 'This is the label for the field',
                      },
                    },
                  ],
                },
                {
                  id: 'collector.requesterId',
                  conditionals: [
                    {
                      type: 'SHOW',
                      conditional: {
                        type: 'object',
                        allOf: [
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'informant.relation': {
                                    oneOf: [
                                      {
                                        type: 'string',
                                        const: 'LEGAL_GUARDIAN',
                                      },
                                      {
                                        type: 'boolean',
                                        const: 'LEGAL_GUARDIAN',
                                      },
                                    ],
                                    const: 'LEGAL_GUARDIAN',
                                  },
                                },
                                required: ['informant.relation'],
                              },
                            },
                            required: ['$form'],
                          },
                          {
                            type: 'object',
                            not: {
                              type: 'object',
                              properties: {
                                $form: {
                                  type: 'object',
                                  properties: {
                                    'mother.firstname': {
                                      anyOf: [
                                        {
                                          const: 'undefined',
                                        },
                                        {
                                          const: false,
                                        },
                                        {
                                          const: null,
                                        },
                                        {
                                          const: '',
                                        },
                                      ],
                                    },
                                  },
                                  anyOf: [
                                    {
                                      required: ['mother.firstname'],
                                    },
                                    {
                                      not: {
                                        required: ['mother.firstname'],
                                      },
                                    },
                                  ],
                                },
                              },
                              required: ['$form'],
                            },
                            required: [],
                          },
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'father.firstname': {
                                    anyOf: [
                                      {
                                        const: 'undefined',
                                      },
                                      {
                                        const: false,
                                      },
                                      {
                                        const: null,
                                      },
                                      {
                                        const: '',
                                      },
                                    ],
                                  },
                                },
                                anyOf: [
                                  {
                                    required: ['father.firstname'],
                                  },
                                  {
                                    not: {
                                      required: ['father.firstname'],
                                    },
                                  },
                                ],
                              },
                            },
                            required: ['$form'],
                          },
                        ],
                        required: [],
                      },
                    },
                  ],
                  required: true,
                  label: {
                    id: 'v2.event.birth.action.certificate.form.section.requester.label',
                    defaultMessage: 'Requester',
                    description: 'This is the label for the field',
                  },
                  type: 'SELECT',
                  options: [
                    {
                      value: 'INFORMANT',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.informant.legal_guardian.label',
                        defaultMessage:
                          'Print and issue to Informant (Legal guardian)',
                        description: 'This is the label for the field',
                      },
                    },
                    {
                      value: 'MOTHER',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.mother.label',
                        defaultMessage: 'Print and issue to Mother',
                        description: 'This is the label for the field',
                      },
                    },
                    {
                      value: 'SOMEONE_ELSE',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.other.label',
                        defaultMessage: 'Print and issue to someone else',
                        description: 'This is the label for the field',
                      },
                    },
                  ],
                },
                {
                  id: 'collector.requesterId',
                  conditionals: [
                    {
                      type: 'SHOW',
                      conditional: {
                        type: 'object',
                        allOf: [
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'informant.relation': {
                                    oneOf: [
                                      {
                                        type: 'string',
                                        const: 'LEGAL_GUARDIAN',
                                      },
                                      {
                                        type: 'boolean',
                                        const: 'LEGAL_GUARDIAN',
                                      },
                                    ],
                                    const: 'LEGAL_GUARDIAN',
                                  },
                                },
                                required: ['informant.relation'],
                              },
                            },
                            required: ['$form'],
                          },
                          {
                            type: 'object',
                            not: {
                              type: 'object',
                              properties: {
                                $form: {
                                  type: 'object',
                                  properties: {
                                    'father.firstname': {
                                      anyOf: [
                                        {
                                          const: 'undefined',
                                        },
                                        {
                                          const: false,
                                        },
                                        {
                                          const: null,
                                        },
                                        {
                                          const: '',
                                        },
                                      ],
                                    },
                                  },
                                  anyOf: [
                                    {
                                      required: ['father.firstname'],
                                    },
                                    {
                                      not: {
                                        required: ['father.firstname'],
                                      },
                                    },
                                  ],
                                },
                              },
                              required: ['$form'],
                            },
                            required: [],
                          },
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'mother.firstname': {
                                    anyOf: [
                                      {
                                        const: 'undefined',
                                      },
                                      {
                                        const: false,
                                      },
                                      {
                                        const: null,
                                      },
                                      {
                                        const: '',
                                      },
                                    ],
                                  },
                                },
                                anyOf: [
                                  {
                                    required: ['mother.firstname'],
                                  },
                                  {
                                    not: {
                                      required: ['mother.firstname'],
                                    },
                                  },
                                ],
                              },
                            },
                            required: ['$form'],
                          },
                        ],
                        required: [],
                      },
                    },
                  ],
                  required: true,
                  label: {
                    id: 'v2.event.birth.action.certificate.form.section.requester.label',
                    defaultMessage: 'Requester',
                    description: 'This is the label for the field',
                  },
                  type: 'SELECT',
                  options: [
                    {
                      value: 'INFORMANT',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.informant.legal_guardian.label',
                        defaultMessage:
                          'Print and issue to Informant (Legal guardian)',
                        description: 'This is the label for the field',
                      },
                    },
                    {
                      value: 'FATHER',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.father.label',
                        defaultMessage: 'Print and issue to Father',
                        description: 'This is the label for the field',
                      },
                    },
                    {
                      value: 'SOMEONE_ELSE',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.other.label',
                        defaultMessage: 'Print and issue to someone else',
                        description: 'This is the label for the field',
                      },
                    },
                  ],
                },
                {
                  id: 'collector.requesterId',
                  conditionals: [
                    {
                      type: 'SHOW',
                      conditional: {
                        type: 'object',
                        allOf: [
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'informant.relation': {
                                    oneOf: [
                                      {
                                        type: 'string',
                                        const: 'LEGAL_GUARDIAN',
                                      },
                                      {
                                        type: 'boolean',
                                        const: 'LEGAL_GUARDIAN',
                                      },
                                    ],
                                    const: 'LEGAL_GUARDIAN',
                                  },
                                },
                                required: ['informant.relation'],
                              },
                            },
                            required: ['$form'],
                          },
                          {
                            type: 'object',
                            not: {
                              type: 'object',
                              properties: {
                                $form: {
                                  type: 'object',
                                  properties: {
                                    'father.firstname': {
                                      anyOf: [
                                        {
                                          const: 'undefined',
                                        },
                                        {
                                          const: false,
                                        },
                                        {
                                          const: null,
                                        },
                                        {
                                          const: '',
                                        },
                                      ],
                                    },
                                  },
                                  anyOf: [
                                    {
                                      required: ['father.firstname'],
                                    },
                                    {
                                      not: {
                                        required: ['father.firstname'],
                                      },
                                    },
                                  ],
                                },
                              },
                              required: ['$form'],
                            },
                            required: [],
                          },
                          {
                            type: 'object',
                            not: {
                              type: 'object',
                              properties: {
                                $form: {
                                  type: 'object',
                                  properties: {
                                    'mother.firstname': {
                                      anyOf: [
                                        {
                                          const: 'undefined',
                                        },
                                        {
                                          const: false,
                                        },
                                        {
                                          const: null,
                                        },
                                        {
                                          const: '',
                                        },
                                      ],
                                    },
                                  },
                                  anyOf: [
                                    {
                                      required: ['mother.firstname'],
                                    },
                                    {
                                      not: {
                                        required: ['mother.firstname'],
                                      },
                                    },
                                  ],
                                },
                              },
                              required: ['$form'],
                            },
                            required: [],
                          },
                        ],
                        required: [],
                      },
                    },
                  ],
                  required: true,
                  label: {
                    id: 'v2.event.birth.action.certificate.form.section.requester.label',
                    defaultMessage: 'Requester',
                    description: 'This is the label for the field',
                  },
                  type: 'SELECT',
                  options: [
                    {
                      value: 'INFORMANT',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.informant.legal_guardian.label',
                        defaultMessage:
                          'Print and issue to Informant (Legal guardian)',
                        description: 'This is the label for the field',
                      },
                    },
                    {
                      value: 'FATHER',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.father.label',
                        defaultMessage: 'Print and issue to Father',
                        description: 'This is the label for the field',
                      },
                    },
                    {
                      value: 'MOTHER',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.mother.label',
                        defaultMessage: 'Print and issue to Mother',
                        description: 'This is the label for the field',
                      },
                    },
                    {
                      value: 'SOMEONE_ELSE',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.other.label',
                        defaultMessage: 'Print and issue to someone else',
                        description: 'This is the label for the field',
                      },
                    },
                  ],
                },
                {
                  id: 'collector.requesterId',
                  conditionals: [
                    {
                      type: 'SHOW',
                      conditional: {
                        type: 'object',
                        allOf: [
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'informant.relation': {
                                    oneOf: [
                                      {
                                        type: 'string',
                                        const: 'LEGAL_GUARDIAN',
                                      },
                                      {
                                        type: 'boolean',
                                        const: 'LEGAL_GUARDIAN',
                                      },
                                    ],
                                    const: 'LEGAL_GUARDIAN',
                                  },
                                },
                                required: ['informant.relation'],
                              },
                            },
                            required: ['$form'],
                          },
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'father.firstname': {
                                    anyOf: [
                                      {
                                        const: 'undefined',
                                      },
                                      {
                                        const: false,
                                      },
                                      {
                                        const: null,
                                      },
                                      {
                                        const: '',
                                      },
                                    ],
                                  },
                                },
                                anyOf: [
                                  {
                                    required: ['father.firstname'],
                                  },
                                  {
                                    not: {
                                      required: ['father.firstname'],
                                    },
                                  },
                                ],
                              },
                            },
                            required: ['$form'],
                          },
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'mother.firstname': {
                                    anyOf: [
                                      {
                                        const: 'undefined',
                                      },
                                      {
                                        const: false,
                                      },
                                      {
                                        const: null,
                                      },
                                      {
                                        const: '',
                                      },
                                    ],
                                  },
                                },
                                anyOf: [
                                  {
                                    required: ['mother.firstname'],
                                  },
                                  {
                                    not: {
                                      required: ['mother.firstname'],
                                    },
                                  },
                                ],
                              },
                            },
                            required: ['$form'],
                          },
                        ],
                        required: [],
                      },
                    },
                  ],
                  required: true,
                  label: {
                    id: 'v2.event.birth.action.certificate.form.section.requester.label',
                    defaultMessage: 'Requester',
                    description: 'This is the label for the field',
                  },
                  type: 'SELECT',
                  options: [
                    {
                      value: 'INFORMANT',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.informant.legal_guardian.label',
                        defaultMessage:
                          'Print and issue to Informant (Legal guardian)',
                        description: 'This is the label for the field',
                      },
                    },
                    {
                      value: 'SOMEONE_ELSE',
                      label: {
                        id: 'v2.event.birth.action.certificate.form.section.requester.other.label',
                        defaultMessage: 'Print and issue to someone else',
                        description: 'This is the label for the field',
                      },
                    },
                  ],
                },
                {
                  id: 'collector.OTHER.idType',
                  conditionals: [
                    {
                      type: 'SHOW',
                      conditional: {
                        type: 'object',
                        properties: {
                          $form: {
                            type: 'object',
                            properties: {
                              'collector.requesterId': {
                                oneOf: [
                                  {
                                    type: 'string',
                                    const: 'SOMEONE_ELSE',
                                  },
                                  {
                                    type: 'boolean',
                                    const: 'SOMEONE_ELSE',
                                  },
                                ],
                                const: 'SOMEONE_ELSE',
                              },
                            },
                            required: ['collector.requesterId'],
                          },
                        },
                        required: ['$form'],
                      },
                    },
                  ],
                  required: true,
                  label: {
                    id: 'v2.event.birth.action.form.section.idType.label',
                    defaultMessage: 'Type of ID',
                    description:
                      'This is the label for selecting the type of ID',
                  },
                  type: 'SELECT',
                  options: [
                    {
                      value: 'PASSPORT',
                      label: {
                        id: 'v2.event.birth.action.form.section.idType.passport.label',
                        defaultMessage: 'Passport',
                        description:
                          'Option for selecting Passport as the ID type',
                      },
                    },
                    {
                      value: 'NATIONAL_ID',
                      label: {
                        id: 'v2.event.birth.action.form.section.idType.nid.label',
                        defaultMessage: 'National ID',
                        description:
                          'Option for selecting National ID as the ID type',
                      },
                    },
                    {
                      value: 'DRIVING_LICENSE',
                      label: {
                        id: 'v2.event.birth.action.form.section.idType.drivingLicense.label',
                        defaultMessage: 'Drivers License',
                        description:
                          'Option for selecting Driving License as the ID type',
                      },
                    },
                    {
                      value: 'BIRTH_REGISTRATION_NUMBER',
                      label: {
                        id: 'v2.event.birth.action.form.section.idType.brn.label',
                        defaultMessage: 'Birth Registration Number',
                        description:
                          'Option for selecting Birth Registration Number as the ID type',
                      },
                    },
                    {
                      value: 'REFUGEE_NUMBER',
                      label: {
                        id: 'v2.event.birth.action.form.section.idType.refugeeNumber.label',
                        defaultMessage: 'Refugee Number',
                        description:
                          'Option for selecting Refugee Number as the ID type',
                      },
                    },
                    {
                      value: 'ALIEN_NUMBER',
                      label: {
                        id: 'v2.event.birth.action.form.section.idType.alienNumber.label',
                        defaultMessage: 'Alien Number',
                        description:
                          'Option for selecting Alien Number as the ID type',
                      },
                    },
                    {
                      value: 'OTHER',
                      label: {
                        id: 'v2.event.birth.action.form.section.idType.other.label',
                        defaultMessage: 'Other',
                        description:
                          'Option for selecting Other as the ID type',
                      },
                    },
                    {
                      value: 'NO_ID',
                      label: {
                        id: 'v2.event.birth.action.form.section.idType.noId.label',
                        defaultMessage: 'No ID available',
                        description:
                          'Option for selecting No ID as the ID type',
                      },
                    },
                  ],
                },
                {
                  id: 'collector.PASSPORT.details',
                  conditionals: [
                    {
                      type: 'SHOW',
                      conditional: {
                        type: 'object',
                        allOf: [
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'collector.requesterId': {
                                    oneOf: [
                                      {
                                        type: 'string',
                                        const: 'SOMEONE_ELSE',
                                      },
                                      {
                                        type: 'boolean',
                                        const: 'SOMEONE_ELSE',
                                      },
                                    ],
                                    const: 'SOMEONE_ELSE',
                                  },
                                },
                                required: ['collector.requesterId'],
                              },
                            },
                            required: ['$form'],
                          },
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'collector.OTHER.idType': {
                                    oneOf: [
                                      {
                                        type: 'string',
                                        const: 'PASSPORT',
                                      },
                                      {
                                        type: 'boolean',
                                        const: 'PASSPORT',
                                      },
                                    ],
                                    const: 'PASSPORT',
                                  },
                                },
                                required: ['collector.OTHER.idType'],
                              },
                            },
                            required: ['$form'],
                          },
                        ],
                        required: [],
                      },
                    },
                  ],
                  required: true,
                  label: {
                    id: 'v2.event.birth.action.form.section.passportDetails.label',
                    defaultMessage: 'Passport',
                    description: 'Field for entering Passport details',
                  },
                  type: 'TEXT',
                },
                {
                  id: 'collector.nid',
                  conditionals: [
                    {
                      type: 'SHOW',
                      conditional: {
                        type: 'object',
                        allOf: [
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'collector.requesterId': {
                                    oneOf: [
                                      {
                                        type: 'string',
                                        const: 'SOMEONE_ELSE',
                                      },
                                      {
                                        type: 'boolean',
                                        const: 'SOMEONE_ELSE',
                                      },
                                    ],
                                    const: 'SOMEONE_ELSE',
                                  },
                                },
                                required: ['collector.requesterId'],
                              },
                            },
                            required: ['$form'],
                          },
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'collector.OTHER.idType': {
                                    oneOf: [
                                      {
                                        type: 'string',
                                        const: 'NATIONAL_ID',
                                      },
                                      {
                                        type: 'boolean',
                                        const: 'NATIONAL_ID',
                                      },
                                    ],
                                    const: 'NATIONAL_ID',
                                  },
                                },
                                required: ['collector.OTHER.idType'],
                              },
                            },
                            required: ['$form'],
                          },
                        ],
                        required: [],
                      },
                    },
                  ],
                  required: true,
                  validation: [
                    {
                      validator: {
                        type: 'object',
                        properties: {
                          $form: {
                            type: 'object',
                            properties: {
                              'collector.nid': {
                                type: 'string',
                                pattern: '^[0-9]{10}$',
                                description:
                                  'Must be numeric and 10 digits long.',
                              },
                            },
                          },
                        },
                        required: ['$form'],
                      },
                      message: {
                        id: 'v2.error.invalidNationalId',
                        defaultMessage:
                          'The national ID can only be numeric and must be 10 digits long',
                        description:
                          'This is the error message for an invalid national ID',
                      },
                    },
                  ],
                  label: {
                    id: 'v2.event.birth.action.form.section.nid.label',
                    defaultMessage: 'National ID',
                    description: 'Field for entering ID Number',
                  },
                  type: 'TEXT',
                },
                {
                  id: 'collector.DRIVING_LICENSE.details',
                  conditionals: [
                    {
                      type: 'SHOW',
                      conditional: {
                        type: 'object',
                        allOf: [
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'collector.requesterId': {
                                    oneOf: [
                                      {
                                        type: 'string',
                                        const: 'SOMEONE_ELSE',
                                      },
                                      {
                                        type: 'boolean',
                                        const: 'SOMEONE_ELSE',
                                      },
                                    ],
                                    const: 'SOMEONE_ELSE',
                                  },
                                },
                                required: ['collector.requesterId'],
                              },
                            },
                            required: ['$form'],
                          },
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'collector.OTHER.idType': {
                                    oneOf: [
                                      {
                                        type: 'string',
                                        const: 'DRIVING_LICENSE',
                                      },
                                      {
                                        type: 'boolean',
                                        const: 'DRIVING_LICENSE',
                                      },
                                    ],
                                    const: 'DRIVING_LICENSE',
                                  },
                                },
                                required: ['collector.OTHER.idType'],
                              },
                            },
                            required: ['$form'],
                          },
                        ],
                        required: [],
                      },
                    },
                  ],
                  required: true,
                  label: {
                    id: 'v2.event.birth.action.form.section.drivingLicenseDetails.label',
                    defaultMessage: 'Drivers License',
                    description: 'Field for entering Driving License details',
                  },
                  type: 'TEXT',
                },
                {
                  id: 'collector.brn',
                  conditionals: [
                    {
                      type: 'SHOW',
                      conditional: {
                        type: 'object',
                        allOf: [
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'collector.requesterId': {
                                    oneOf: [
                                      {
                                        type: 'string',
                                        const: 'SOMEONE_ELSE',
                                      },
                                      {
                                        type: 'boolean',
                                        const: 'SOMEONE_ELSE',
                                      },
                                    ],
                                    const: 'SOMEONE_ELSE',
                                  },
                                },
                                required: ['collector.requesterId'],
                              },
                            },
                            required: ['$form'],
                          },
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'collector.OTHER.idType': {
                                    oneOf: [
                                      {
                                        type: 'string',
                                        const: 'BIRTH_REGISTRATION_NUMBER',
                                      },
                                      {
                                        type: 'boolean',
                                        const: 'BIRTH_REGISTRATION_NUMBER',
                                      },
                                    ],
                                    const: 'BIRTH_REGISTRATION_NUMBER',
                                  },
                                },
                                required: ['collector.OTHER.idType'],
                              },
                            },
                            required: ['$form'],
                          },
                        ],
                        required: [],
                      },
                    },
                  ],
                  required: true,
                  label: {
                    id: 'v2.event.birth.action.form.section.brn.label',
                    defaultMessage: 'Birth Registration Number',
                    description: 'Field for entering Birth Registration Number',
                  },
                  type: 'TEXT',
                },
                {
                  id: 'collector.REFUGEE_NUMBER.details',
                  conditionals: [
                    {
                      type: 'SHOW',
                      conditional: {
                        type: 'object',
                        allOf: [
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'collector.requesterId': {
                                    oneOf: [
                                      {
                                        type: 'string',
                                        const: 'SOMEONE_ELSE',
                                      },
                                      {
                                        type: 'boolean',
                                        const: 'SOMEONE_ELSE',
                                      },
                                    ],
                                    const: 'SOMEONE_ELSE',
                                  },
                                },
                                required: ['collector.requesterId'],
                              },
                            },
                            required: ['$form'],
                          },
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'collector.OTHER.idType': {
                                    oneOf: [
                                      {
                                        type: 'string',
                                        const: 'REFUGEE_NUMBER',
                                      },
                                      {
                                        type: 'boolean',
                                        const: 'REFUGEE_NUMBER',
                                      },
                                    ],
                                    const: 'REFUGEE_NUMBER',
                                  },
                                },
                                required: ['collector.OTHER.idType'],
                              },
                            },
                            required: ['$form'],
                          },
                        ],
                        required: [],
                      },
                    },
                  ],
                  required: true,
                  label: {
                    id: 'v2.event.birth.action.form.section.refugeeNumberDetails.label',
                    defaultMessage: 'Refugee Number',
                    description: 'Field for entering Refugee Number details',
                  },
                  type: 'TEXT',
                },
                {
                  id: 'collector.ALIEN_NUMBER.details',
                  conditionals: [
                    {
                      type: 'SHOW',
                      conditional: {
                        type: 'object',
                        allOf: [
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'collector.requesterId': {
                                    oneOf: [
                                      {
                                        type: 'string',
                                        const: 'SOMEONE_ELSE',
                                      },
                                      {
                                        type: 'boolean',
                                        const: 'SOMEONE_ELSE',
                                      },
                                    ],
                                    const: 'SOMEONE_ELSE',
                                  },
                                },
                                required: ['collector.requesterId'],
                              },
                            },
                            required: ['$form'],
                          },
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'collector.OTHER.idType': {
                                    oneOf: [
                                      {
                                        type: 'string',
                                        const: 'ALIEN_NUMBER',
                                      },
                                      {
                                        type: 'boolean',
                                        const: 'ALIEN_NUMBER',
                                      },
                                    ],
                                    const: 'ALIEN_NUMBER',
                                  },
                                },
                                required: ['collector.OTHER.idType'],
                              },
                            },
                            required: ['$form'],
                          },
                        ],
                        required: [],
                      },
                    },
                  ],
                  required: true,
                  label: {
                    id: 'v2.event.birth.action.form.section.alienNumberDetails.label',
                    defaultMessage: 'Alien Number',
                    description: 'Field for entering Alien Number details',
                  },
                  type: 'TEXT',
                },
                {
                  id: 'collector.OTHER.idTypeOther',
                  conditionals: [
                    {
                      type: 'SHOW',
                      conditional: {
                        type: 'object',
                        allOf: [
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'collector.requesterId': {
                                    oneOf: [
                                      {
                                        type: 'string',
                                        const: 'SOMEONE_ELSE',
                                      },
                                      {
                                        type: 'boolean',
                                        const: 'SOMEONE_ELSE',
                                      },
                                    ],
                                    const: 'SOMEONE_ELSE',
                                  },
                                },
                                required: ['collector.requesterId'],
                              },
                            },
                            required: ['$form'],
                          },
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'collector.OTHER.idType': {
                                    oneOf: [
                                      {
                                        type: 'string',
                                        const: 'OTHER',
                                      },
                                      {
                                        type: 'boolean',
                                        const: 'OTHER',
                                      },
                                    ],
                                    const: 'OTHER',
                                  },
                                },
                                required: ['collector.OTHER.idType'],
                              },
                            },
                            required: ['$form'],
                          },
                        ],
                        required: [],
                      },
                    },
                  ],
                  required: true,
                  label: {
                    id: 'v2.event.birth.action.form.section.idTypeOther.label',
                    defaultMessage: 'Other type of ID',
                    description:
                      'Field for entering ID type if "Other" is selected',
                  },
                  type: 'TEXT',
                },
                {
                  id: 'collector.OTHER.idNumberOther',
                  conditionals: [
                    {
                      type: 'SHOW',
                      conditional: {
                        type: 'object',
                        allOf: [
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'collector.requesterId': {
                                    oneOf: [
                                      {
                                        type: 'string',
                                        const: 'SOMEONE_ELSE',
                                      },
                                      {
                                        type: 'boolean',
                                        const: 'SOMEONE_ELSE',
                                      },
                                    ],
                                    const: 'SOMEONE_ELSE',
                                  },
                                },
                                required: ['collector.requesterId'],
                              },
                            },
                            required: ['$form'],
                          },
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'collector.OTHER.idType': {
                                    oneOf: [
                                      {
                                        type: 'string',
                                        const: 'OTHER',
                                      },
                                      {
                                        type: 'boolean',
                                        const: 'OTHER',
                                      },
                                    ],
                                    const: 'OTHER',
                                  },
                                },
                                required: ['collector.OTHER.idType'],
                              },
                            },
                            required: ['$form'],
                          },
                        ],
                        required: [],
                      },
                    },
                  ],
                  required: true,
                  label: {
                    id: 'v2.event.birth.action.form.section.idNumberOther.label',
                    defaultMessage: 'ID Number',
                    description:
                      'Field for entering ID Number if "Other" is selected',
                  },
                  type: 'TEXT',
                },
                {
                  id: 'collector.OTHER.firstName',
                  conditionals: [
                    {
                      type: 'SHOW',
                      conditional: {
                        type: 'object',
                        properties: {
                          $form: {
                            type: 'object',
                            properties: {
                              'collector.requesterId': {
                                oneOf: [
                                  {
                                    type: 'string',
                                    const: 'SOMEONE_ELSE',
                                  },
                                  {
                                    type: 'boolean',
                                    const: 'SOMEONE_ELSE',
                                  },
                                ],
                                const: 'SOMEONE_ELSE',
                              },
                            },
                            required: ['collector.requesterId'],
                          },
                        },
                        required: ['$form'],
                      },
                    },
                  ],
                  required: true,
                  label: {
                    id: 'v2.event.birth.action.form.section.firstName.label',
                    defaultMessage: 'First Name',
                    description: 'This is the label for the first name field',
                  },
                  type: 'TEXT',
                },
                {
                  id: 'collector.OTHER.lastName',
                  conditionals: [
                    {
                      type: 'SHOW',
                      conditional: {
                        type: 'object',
                        properties: {
                          $form: {
                            type: 'object',
                            properties: {
                              'collector.requesterId': {
                                oneOf: [
                                  {
                                    type: 'string',
                                    const: 'SOMEONE_ELSE',
                                  },
                                  {
                                    type: 'boolean',
                                    const: 'SOMEONE_ELSE',
                                  },
                                ],
                                const: 'SOMEONE_ELSE',
                              },
                            },
                            required: ['collector.requesterId'],
                          },
                        },
                        required: ['$form'],
                      },
                    },
                  ],
                  required: true,
                  label: {
                    id: 'v2.event.birth.action.form.section.lastName.label',
                    defaultMessage: 'Last Name',
                    description: 'This is the label for the last name field',
                  },
                  type: 'TEXT',
                },
                {
                  id: 'collector.OTHER.relationshipToChild',
                  conditionals: [
                    {
                      type: 'SHOW',
                      conditional: {
                        type: 'object',
                        properties: {
                          $form: {
                            type: 'object',
                            properties: {
                              'collector.requesterId': {
                                oneOf: [
                                  {
                                    type: 'string',
                                    const: 'SOMEONE_ELSE',
                                  },
                                  {
                                    type: 'boolean',
                                    const: 'SOMEONE_ELSE',
                                  },
                                ],
                                const: 'SOMEONE_ELSE',
                              },
                            },
                            required: ['collector.requesterId'],
                          },
                        },
                        required: ['$form'],
                      },
                    },
                  ],
                  required: true,
                  label: {
                    id: 'v2.event.birth.action.form.section.relationshipToChild.label',
                    defaultMessage: 'Relationship to child',
                    description:
                      'This is the label for the relationship to child field',
                  },
                  type: 'TEXT',
                },
                {
                  id: 'collector.OTHER.signedAffidavit',
                  conditionals: [
                    {
                      type: 'SHOW',
                      conditional: {
                        type: 'object',
                        properties: {
                          $form: {
                            type: 'object',
                            properties: {
                              'collector.requesterId': {
                                oneOf: [
                                  {
                                    type: 'string',
                                    const: 'SOMEONE_ELSE',
                                  },
                                  {
                                    type: 'boolean',
                                    const: 'SOMEONE_ELSE',
                                  },
                                ],
                                const: 'SOMEONE_ELSE',
                              },
                            },
                            required: ['collector.requesterId'],
                          },
                        },
                        required: ['$form'],
                      },
                    },
                  ],
                  required: false,
                  label: {
                    id: 'v2.event.birth.action.form.section.signedAffidavit.label',
                    defaultMessage: 'Signed Affidavit (Optional)',
                    description:
                      'This is the label for uploading a signed affidavit',
                  },
                  type: 'FILE',
                  configuration: {
                    maxFileSize: 5242880,
                    acceptedFileTypes: ['image/png', 'image/jpg', 'image/jpeg'],
                    fileName: {
                      id: 'v2.event.birth.action.form.section.signedAffidavit.fileName',
                      defaultMessage: 'Signed Affidavit',
                      description: 'This is the label for the file name',
                    },
                  },
                },
              ],
              type: 'FORM',
            },
            {
              id: 'collector.identity.verify',
              title: {
                id: 'event.birth.action.print.verifyIdentity',
                defaultMessage: 'Verify their identity',
                description: 'This is the title of the section',
              },
              fields: [
                {
                  id: 'collector.identity.verify.data.mother',
                  conditionals: [
                    {
                      type: 'SHOW',
                      conditional: {
                        type: 'object',
                        anyOf: [
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'collector.requesterId': {
                                    oneOf: [
                                      {
                                        type: 'string',
                                        const: 'MOTHER',
                                      },
                                      {
                                        type: 'boolean',
                                        const: 'MOTHER',
                                      },
                                    ],
                                    const: 'MOTHER',
                                  },
                                },
                                required: ['collector.requesterId'],
                              },
                            },
                            required: ['$form'],
                          },
                          {
                            type: 'object',
                            allOf: [
                              {
                                type: 'object',
                                properties: {
                                  $form: {
                                    type: 'object',
                                    properties: {
                                      'collector.requesterId': {
                                        oneOf: [
                                          {
                                            type: 'string',
                                            const: 'INFORMANT',
                                          },
                                          {
                                            type: 'boolean',
                                            const: 'INFORMANT',
                                          },
                                        ],
                                        const: 'INFORMANT',
                                      },
                                    },
                                    required: ['collector.requesterId'],
                                  },
                                },
                                required: ['$form'],
                              },
                              {
                                type: 'object',
                                properties: {
                                  $form: {
                                    type: 'object',
                                    properties: {
                                      'informant.relation': {
                                        oneOf: [
                                          {
                                            type: 'string',
                                            const: 'MOTHER',
                                          },
                                          {
                                            type: 'boolean',
                                            const: 'MOTHER',
                                          },
                                        ],
                                        const: 'MOTHER',
                                      },
                                    },
                                    required: ['informant.relation'],
                                  },
                                },
                                required: ['$form'],
                              },
                            ],
                            required: [],
                          },
                        ],
                        required: [],
                      },
                    },
                  ],
                  label: {
                    id: 'v2.event.birth.action.certificate.form.section.verifyIdentity.data.label',
                    defaultMessage: '',
                    description: 'Title for the data section',
                  },
                  type: 'DATA',
                  configuration: {
                    data: [
                      {
                        fieldId: 'mother.idType',
                      },
                      {
                        fieldId: 'mother.nid',
                      },
                      {
                        fieldId: 'mother.passport',
                      },
                      {
                        fieldId: 'mother.brn',
                      },
                      {
                        fieldId: 'mother.firstname',
                      },
                      {
                        fieldId: 'mother.surname',
                      },
                      {
                        fieldId: 'mother.dob',
                      },
                      {
                        fieldId: 'mother.age',
                      },
                      {
                        fieldId: 'mother.nationality',
                      },
                    ],
                  },
                },
                {
                  id: 'collector.identity.verify.data.father',
                  conditionals: [
                    {
                      type: 'SHOW',
                      conditional: {
                        type: 'object',
                        anyOf: [
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'collector.requesterId': {
                                    oneOf: [
                                      {
                                        type: 'string',
                                        const: 'FATHER',
                                      },
                                      {
                                        type: 'boolean',
                                        const: 'FATHER',
                                      },
                                    ],
                                    const: 'FATHER',
                                  },
                                },
                                required: ['collector.requesterId'],
                              },
                            },
                            required: ['$form'],
                          },
                          {
                            type: 'object',
                            allOf: [
                              {
                                type: 'object',
                                properties: {
                                  $form: {
                                    type: 'object',
                                    properties: {
                                      'collector.requesterId': {
                                        oneOf: [
                                          {
                                            type: 'string',
                                            const: 'INFORMANT',
                                          },
                                          {
                                            type: 'boolean',
                                            const: 'INFORMANT',
                                          },
                                        ],
                                        const: 'INFORMANT',
                                      },
                                    },
                                    required: ['collector.requesterId'],
                                  },
                                },
                                required: ['$form'],
                              },
                              {
                                type: 'object',
                                properties: {
                                  $form: {
                                    type: 'object',
                                    properties: {
                                      'informant.relation': {
                                        oneOf: [
                                          {
                                            type: 'string',
                                            const: 'FATHER',
                                          },
                                          {
                                            type: 'boolean',
                                            const: 'FATHER',
                                          },
                                        ],
                                        const: 'FATHER',
                                      },
                                    },
                                    required: ['informant.relation'],
                                  },
                                },
                                required: ['$form'],
                              },
                            ],
                            required: [],
                          },
                        ],
                        required: [],
                      },
                    },
                  ],
                  label: {
                    id: 'v2.event.birth.action.certificate.form.section.verifyIdentity.data.label',
                    defaultMessage: '',
                    description: 'Title for the data section',
                  },
                  type: 'DATA',
                  configuration: {
                    data: [
                      {
                        fieldId: 'father.idType',
                      },
                      {
                        fieldId: 'father.nid',
                      },
                      {
                        fieldId: 'father.passport',
                      },
                      {
                        fieldId: 'father.brn',
                      },
                      {
                        fieldId: 'father.firstname',
                      },
                      {
                        fieldId: 'father.surname',
                      },
                      {
                        fieldId: 'father.dob',
                      },
                      {
                        fieldId: 'father.age',
                      },
                      {
                        fieldId: 'father.nationality',
                      },
                    ],
                  },
                },
                {
                  id: 'collector.identity.verify.data.other',
                  conditionals: [
                    {
                      type: 'SHOW',
                      conditional: {
                        type: 'object',
                        allOf: [
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'collector.requesterId': {
                                    oneOf: [
                                      {
                                        type: 'string',
                                        const: 'INFORMANT',
                                      },
                                      {
                                        type: 'boolean',
                                        const: 'INFORMANT',
                                      },
                                    ],
                                    const: 'INFORMANT',
                                  },
                                },
                                required: ['collector.requesterId'],
                              },
                            },
                            required: ['$form'],
                          },
                          {
                            type: 'object',
                            not: {
                              type: 'object',
                              properties: {
                                $form: {
                                  type: 'object',
                                  properties: {
                                    'informant.relation': {
                                      oneOf: [
                                        {
                                          type: 'string',
                                          const: 'FATHER',
                                        },
                                        {
                                          type: 'boolean',
                                          const: 'FATHER',
                                        },
                                      ],
                                      const: 'FATHER',
                                    },
                                  },
                                  required: ['informant.relation'],
                                },
                              },
                              required: ['$form'],
                            },
                            required: [],
                          },
                          {
                            type: 'object',
                            not: {
                              type: 'object',
                              properties: {
                                $form: {
                                  type: 'object',
                                  properties: {
                                    'informant.relation': {
                                      oneOf: [
                                        {
                                          type: 'string',
                                          const: 'MOTHER',
                                        },
                                        {
                                          type: 'boolean',
                                          const: 'MOTHER',
                                        },
                                      ],
                                      const: 'MOTHER',
                                    },
                                  },
                                  required: ['informant.relation'],
                                },
                              },
                              required: ['$form'],
                            },
                            required: [],
                          },
                        ],
                        required: [],
                      },
                    },
                  ],
                  label: {
                    id: 'v2.event.birth.action.certificate.form.section.verifyIdentity.data.label',
                    defaultMessage: '',
                    description: 'Title for the data section',
                  },
                  type: 'DATA',
                  configuration: {
                    data: [
                      {
                        fieldId: 'informant.relation',
                      },
                      {
                        fieldId: 'informant.idType',
                      },
                      {
                        fieldId: 'informant.nid',
                      },
                      {
                        fieldId: 'informant.passport',
                      },
                      {
                        fieldId: 'informant.brn',
                      },
                      {
                        fieldId: 'informant.firstname',
                      },
                      {
                        fieldId: 'informant.surname',
                      },
                      {
                        fieldId: 'informant.dob',
                      },
                      {
                        fieldId: 'informant.age',
                      },
                      {
                        fieldId: 'informant.nationality',
                      },
                    ],
                  },
                },
              ],
              conditional: {
                type: 'object',
                not: {
                  type: 'object',
                  properties: {
                    $form: {
                      type: 'object',
                      properties: {
                        'collector.requesterId': {
                          oneOf: [
                            {
                              type: 'string',
                              const: 'SOMEONE_ELSE',
                            },
                            {
                              type: 'boolean',
                              const: 'SOMEONE_ELSE',
                            },
                          ],
                          const: 'SOMEONE_ELSE',
                        },
                      },
                      required: ['collector.requesterId'],
                    },
                  },
                  required: ['$form'],
                },
                required: [],
              },
              type: 'VERIFICATION',
              actions: {
                verify: {
                  label: {
                    id: 'v2.event.birth.action.certificate.form.verify',
                    defaultMessage: 'Verified',
                    description:
                      'This is the label for the verification button',
                  },
                },
                cancel: {
                  label: {
                    id: 'v2.event.birth.action.certificate.form.cancel',
                    defaultMessage: 'Identity does not match',
                    description:
                      'This is the label for the verification cancellation button',
                  },
                  confirmation: {
                    title: {
                      id: 'v2.event.birth.action.certificate.form.cancel.confirmation.title',
                      defaultMessage: 'Print without proof of ID?',
                      description:
                        'This is the title for the verification cancellation modal',
                    },
                    body: {
                      id: 'v2.event.birth.action.certificate.form.cancel.confirmation.body',
                      defaultMessage:
                        'Please be aware that if you proceed, you will be responsible for issuing a certificate without the necessary proof of ID from the collector',
                      description:
                        'This is the body for the verification cancellation modal',
                    },
                  },
                },
              },
            },
            {
              id: 'collector.collect.payment',
              title: {
                id: 'event.birth.action.print.collectPayment',
                defaultMessage: 'Collect Payment',
                description: 'This is the title of the section',
              },
              fields: [
                {
                  id: 'collector.collect.payment.data.afterLateRegistrationTarget',
                  conditionals: [
                    {
                      type: 'SHOW',
                      conditional: {
                        type: 'object',
                        allOf: [
                          {
                            type: 'object',
                            not: {
                              type: 'object',
                              properties: {
                                $form: {
                                  type: 'object',
                                  properties: {
                                    'child.dob': {
                                      type: 'string',
                                      format: 'date',
                                      formatMinimum: '2024-06-04',
                                    },
                                  },
                                  required: ['child.dob'],
                                },
                              },
                              required: ['$form'],
                            },
                            required: [],
                          },
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'child.dob': {
                                    type: 'string',
                                    format: 'date',
                                    formatMaximum: '2025-06-04',
                                  },
                                },
                                required: ['child.dob'],
                              },
                            },
                            required: ['$form'],
                          },
                        ],
                        required: [],
                      },
                    },
                  ],
                  label: {
                    id: 'v2.event.birth.action.certificate.form.section.collectPayment.data.label',
                    defaultMessage: 'Payment details',
                    description: 'Title for the data section',
                  },
                  type: 'DATA',
                  configuration: {
                    data: [
                      {
                        label: {
                          id: 'v2.event.birth.action.certificate.form.section.collectPayment.service.label',
                          defaultMessage: 'Service',
                          description: 'Title for the data entry',
                        },
                        value: {
                          id: 'v2.event.birth.action.certificate.form.section.collectPayment.service.label.afterLateRegistrationTarget',
                          defaultMessage:
                            'Birth registration after 365 days of date of birth',
                          description:
                            'Birth registration after 365 days of date of birth message',
                        },
                      },
                      {
                        label: {
                          id: 'v2.event.birth.action.certificate.form.section.collectPayment.fee.label',
                          defaultMessage: 'Fee',
                          description: 'Title for the data entry',
                        },
                        value: '$15.00',
                      },
                    ],
                  },
                },
                {
                  id: 'collector.collect.payment.data.inBetweenRegistrationTargets',
                  conditionals: [
                    {
                      type: 'SHOW',
                      conditional: {
                        type: 'object',
                        allOf: [
                          {
                            type: 'object',
                            not: {
                              type: 'object',
                              properties: {
                                $form: {
                                  type: 'object',
                                  properties: {
                                    'child.dob': {
                                      type: 'string',
                                      format: 'date',
                                      formatMinimum: '2025-05-05',
                                    },
                                  },
                                  required: ['child.dob'],
                                },
                              },
                              required: ['$form'],
                            },
                            required: [],
                          },
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'child.dob': {
                                    type: 'string',
                                    format: 'date',
                                    formatMinimum: '2024-06-04',
                                  },
                                },
                                required: ['child.dob'],
                              },
                            },
                            required: ['$form'],
                          },
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'child.dob': {
                                    type: 'string',
                                    format: 'date',
                                    formatMaximum: '2025-06-04',
                                  },
                                },
                                required: ['child.dob'],
                              },
                            },
                            required: ['$form'],
                          },
                        ],
                        required: [],
                      },
                    },
                  ],
                  label: {
                    id: 'v2.event.birth.action.certificate.form.section.collectPayment.data.label',
                    defaultMessage: 'Payment details',
                    description: 'Title for the data section',
                  },
                  type: 'DATA',
                  configuration: {
                    data: [
                      {
                        label: {
                          id: 'v2.event.birth.action.certificate.form.section.collectPayment.service.label',
                          defaultMessage: 'Service',
                          description: 'Title for the data entry',
                        },
                        value: {
                          id: 'v2.event.birth.action.certificate.form.section.collectPayment.service.label.inBetweenRegistrationTargets',
                          defaultMessage:
                            'Birth registration after 30 days but before 365 days of date of birth',
                          description:
                            'Birth registration after 30 days but before 365 days of date of birth message',
                        },
                      },
                      {
                        label: {
                          id: 'v2.event.birth.action.certificate.form.section.collectPayment.fee.label',
                          defaultMessage: 'Fee',
                          description: 'Title for the data entry',
                        },
                        value: '$7.00',
                      },
                    ],
                  },
                },
                {
                  id: 'collector.collect.payment.data.beforeRegistrationTarget',
                  conditionals: [
                    {
                      type: 'SHOW',
                      conditional: {
                        type: 'object',
                        allOf: [
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'child.dob': {
                                    type: 'string',
                                    format: 'date',
                                    formatMinimum: '2025-05-05',
                                  },
                                },
                                required: ['child.dob'],
                              },
                            },
                            required: ['$form'],
                          },
                          {
                            type: 'object',
                            properties: {
                              $form: {
                                type: 'object',
                                properties: {
                                  'child.dob': {
                                    type: 'string',
                                    format: 'date',
                                    formatMaximum: '2025-06-04',
                                  },
                                },
                                required: ['child.dob'],
                              },
                            },
                            required: ['$form'],
                          },
                        ],
                        required: [],
                      },
                    },
                  ],
                  label: {
                    id: 'v2.event.birth.action.certificate.form.section.collectPayment.data.label',
                    defaultMessage: 'Payment details',
                    description: 'Title for the data section',
                  },
                  type: 'DATA',
                  configuration: {
                    data: [
                      {
                        label: {
                          id: 'v2.event.birth.action.certificate.form.section.collectPayment.service.label',
                          defaultMessage: 'Service',
                          description: 'Title for the data entry',
                        },
                        value: {
                          id: 'v2.event.birth.action.certificate.form.section.collectPayment.service.label.beforeRegistrationTarget',
                          defaultMessage:
                            'Birth registration before 30 days of date of birth',
                          description:
                            'Birth registration before 30 days of date of birth message',
                        },
                      },
                      {
                        label: {
                          id: 'v2.event.birth.action.certificate.form.section.collectPayment.fee.label',
                          defaultMessage: 'Fee',
                          description: 'Title for the data entry',
                        },
                        value: '$5.00',
                      },
                    ],
                  },
                },
              ],
              type: 'FORM',
            },
          ],
        },
      },
    ],
    declaration: {
      label: {
        id: 'v2.event.birth.action.declare.form.label',
        defaultMessage: 'Birth decalration form',
        description: 'This is what this form is referred as in the system',
      },
      pages: [],
    },
    deduplication: [],
    advancedSearch: [
      {
        title: {
          id: 'v2.advancedSearch.form.registrationDetails',
          defaultMessage: 'Registration details',
          description: 'The title of Registration details accordion',
        },
        fields: [
          {
            config: {
              type: 'exact',
            },
            fieldId: 'legalStatus.REGISTERED.createdAtLocation',
            fieldType: 'event',
          },
          {
            config: {
              type: 'range',
            },
            fieldId: 'legalStatus.REGISTERED.createdAt',
            fieldType: 'event',
          },
          {
            config: {
              type: 'exact',
            },
            options: [
              {
                value: 'ALL',
                label: {
                  id: 'v2.advancedSearch.form.recordStatusAny',
                  defaultMessage: 'Any status',
                  description: 'Option for form field: status of record',
                },
              },
              {
                value: 'CREATED',
                label: {
                  id: 'v2.advancedSearch.form.recordStatusCreated',
                  defaultMessage: 'Draft',
                  description: 'Option for form field: status of record',
                },
              },
              {
                value: 'NOTIFIED',
                label: {
                  id: 'v2.advancedSearch.form.recordStatusNotified',
                  defaultMessage: 'Notified',
                  description: 'Option for form field: status of record',
                },
              },
              {
                value: 'DECLARED',
                label: {
                  id: 'v2.advancedSearch.form.recordStatusDeclared',
                  defaultMessage: 'Declared',
                  description: 'Option for form field: status of record',
                },
              },
              {
                value: 'VALIDATED',
                label: {
                  id: 'v2.advancedSearch.form.recordStatusValidated',
                  defaultMessage: 'Validated',
                  description: 'Option for form field: status of record',
                },
              },
              {
                value: 'REGISTERED',
                label: {
                  id: 'v2.advancedSearch.form.recordStatusRegistered',
                  defaultMessage: 'Registered',
                  description: 'Option for form field: status of record',
                },
              },
              {
                value: 'CERTIFIED',
                label: {
                  id: 'v2.advancedSearch.form.recordStatusCertified',
                  defaultMessage: 'Certified',
                  description: 'Option for form field: status of record',
                },
              },
              {
                value: 'REJECTED',
                label: {
                  id: 'v2.advancedSearch.form.recordStatusRejected',
                  defaultMessage: 'Rejected',
                  description: 'Option for form field: status of record',
                },
              },
              {
                value: 'ARCHIVED',
                label: {
                  id: 'v2.advancedSearch.form.recordStatusArchived',
                  defaultMessage: 'Archived',
                  description: 'Option for form field: status of record',
                },
              },
            ],
            fieldId: 'status',
            fieldType: 'event',
          },
          {
            config: {
              type: 'range',
            },
            options: [
              {
                value: '2025-05-28,2025-06-04',
                label: {
                  id: 'form.section.label.timePeriodLast7Days',
                  defaultMessage: 'Last 7 days',
                  description:
                    'Label for option of time period select: last 7 days',
                },
              },
              {
                value: '2025-05-04,2025-06-04',
                label: {
                  id: 'form.section.label.timePeriodLast30Days',
                  defaultMessage: 'Last 30 days',
                  description:
                    'Label for option of time period select: last 30 days',
                },
              },
              {
                value: '2025-03-04,2025-06-04',
                label: {
                  id: 'form.section.label.timePeriodLast90Days',
                  defaultMessage: 'Last 90 days',
                  description:
                    'Label for option of time period select: last 90 days',
                },
              },
              {
                value: '2024-06-04,2025-06-04',
                label: {
                  id: 'form.section.label.timePeriodLastYear',
                  defaultMessage: 'Last year',
                  description:
                    'Label for option of time period select: last year',
                },
              },
            ],
            fieldId: 'updatedAt',
            fieldType: 'event',
          },
        ],
      },
      {
        title: {
          id: 'v2.advancedSearch.form.childDetails',
          defaultMessage: 'Child details',
          description: 'The title of Child details accordion',
        },
        fields: [
          {
            config: {
              type: 'range',
            },
            searchCriteriaLabelPrefix: {
              id: 'v2.birth.search.criteria.label.prefix.child',
              defaultMessage: "Child's",
              description: 'Child prefix',
            },
            fieldId: 'child.dob',
            fieldType: 'field',
          },
          {
            config: {
              type: 'fuzzy',
            },
            searchCriteriaLabelPrefix: {
              id: 'v2.birth.search.criteria.label.prefix.child',
              defaultMessage: "Child's",
              description: 'Child prefix',
            },
            fieldId: 'child.firstname',
            fieldType: 'field',
          },
          {
            config: {
              type: 'fuzzy',
            },
            searchCriteriaLabelPrefix: {
              id: 'v2.birth.search.criteria.label.prefix.child',
              defaultMessage: "Child's",
              description: 'Child prefix',
            },
            fieldId: 'child.surname',
            fieldType: 'field',
          },
          {
            config: {
              type: 'exact',
            },
            searchCriteriaLabelPrefix: {
              id: 'v2.birth.search.criteria.label.prefix.child',
              defaultMessage: "Child's",
              description: 'Child prefix',
            },
            fieldId: 'child.gender',
            fieldType: 'field',
          },
        ],
      },
      {
        title: {
          id: 'v2.advancedSearch.form.eventDetails',
          defaultMessage: 'Event details',
          description: 'The title of Event details accordion',
        },
        fields: [
          {
            config: {
              type: 'exact',
            },
            searchCriteriaLabelPrefix: {
              id: 'v2.birth.search.criteria.label.prefix.child',
              defaultMessage: "Child's",
              description: 'Child prefix',
            },
            conditionals: [],
            fieldId: 'child.birthLocation',
            fieldType: 'field',
          },
        ],
      },
      {
        title: {
          id: 'v2.advancedSearch.form.motherDetails',
          defaultMessage: 'Mother details',
          description: 'The title of Mother details accordion',
        },
        fields: [
          {
            config: {
              type: 'range',
            },
            searchCriteriaLabelPrefix: {
              id: 'v2.birth.search.criteria.label.prefix.mother',
              defaultMessage: "Mother's",
              description: 'Mother prefix',
            },
            fieldId: 'mother.dob',
            fieldType: 'field',
          },
          {
            config: {
              type: 'fuzzy',
            },
            searchCriteriaLabelPrefix: {
              id: 'v2.birth.search.criteria.label.prefix.mother',
              defaultMessage: "Mother's",
              description: 'Mother prefix',
            },
            fieldId: 'mother.firstname',
            fieldType: 'field',
          },
          {
            config: {
              type: 'fuzzy',
            },
            searchCriteriaLabelPrefix: {
              id: 'v2.birth.search.criteria.label.prefix.mother',
              defaultMessage: "Mother's",
              description: 'Mother prefix',
            },
            fieldId: 'mother.surname',
            fieldType: 'field',
          },
        ],
      },
      {
        title: {
          id: 'v2.advancedSearch.form.fatherDetails',
          defaultMessage: 'Father details',
          description: 'The title of Father details accordion',
        },
        fields: [
          {
            config: {
              type: 'range',
            },
            searchCriteriaLabelPrefix: {
              id: 'v2.birth.search.criteria.label.prefix.father',
              defaultMessage: "Father's",
              description: 'Father prefix',
            },
            fieldId: 'father.dob',
            fieldType: 'field',
          },
          {
            config: {
              type: 'fuzzy',
            },
            searchCriteriaLabelPrefix: {
              id: 'v2.birth.search.criteria.label.prefix.father',
              defaultMessage: "Father's",
              description: 'Father prefix',
            },
            fieldId: 'father.firstname',
            fieldType: 'field',
          },
          {
            config: {
              type: 'fuzzy',
            },
            searchCriteriaLabelPrefix: {
              id: 'v2.birth.search.criteria.label.prefix.father',
              defaultMessage: "Father's",
              description: 'Father prefix',
            },
            fieldId: 'father.surname',
            fieldType: 'field',
          },
        ],
      },
      {
        title: {
          id: 'v2.advancedSearch.form.informantDetails',
          defaultMessage: 'Informant details',
          description: 'The title of Informant details accordion',
        },
        fields: [
          {
            config: {
              type: 'range',
            },
            searchCriteriaLabelPrefix: {
              id: 'v2.birth.search.criteria.label.prefix.informant',
              defaultMessage: "Informant's",
              description: 'Informant prefix',
            },
            conditionals: [],
            fieldId: 'informant.dob',
            fieldType: 'field',
          },
          {
            config: {
              type: 'fuzzy',
            },
            searchCriteriaLabelPrefix: {
              id: 'v2.birth.search.criteria.label.prefix.informant',
              defaultMessage: "Informant's",
              description: 'Informant prefix',
            },
            conditionals: [],
            fieldId: 'informant.firstname',
            fieldType: 'field',
          },
          {
            config: {
              type: 'fuzzy',
            },
            searchCriteriaLabelPrefix: {
              id: 'v2.birth.search.criteria.label.prefix.informant',
              defaultMessage: "Informant's",
              description: 'Informant prefix',
            },
            conditionals: [],
            fieldId: 'informant.surname',
            fieldType: 'field',
          },
        ],
      },
    ],
  },
]
