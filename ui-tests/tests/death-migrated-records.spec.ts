import { test, expect, type Page } from "@playwright/test";
import { loginToV2 } from "../helpers";
import { CREDENTIALS } from "../constants";

test.describe.serial("1. Verify migrated death record", () => {
  const recordId = ""; // Figure out a way to fetch migrated record ID's
  const oldUrl = `http://localhost:3000/${recordId}/viewRecord?V2_EVENTS=false`;
  const newUrl = `http://localhost:3000/events/view/${recordId}?V2_EVENTS=true`;
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await loginToV2(page, CREDENTIALS.LOCAL_REGISTRAR);
  });

  test.afterAll(async () => {
    await page.close();
  });

  test.describe("1.1 Detect easy to spot errors in migrated records", async () => {
    test("1.1.1 Detect invalid inputs in migrated record (indicates a mismatch in data type during migration)", async () => {
      await page.goto(newUrl);
      await expect(page.getByText("Death declaration")).toBeVisible();
      await expect(page.getByText(/Invalid input/i)).toHaveCount(0);
    });
    test("1.1.2 Detect required fields in migrated record (indicates possibly overlooked form fields during migration)", async () => {
      await page.goto(newUrl);
      await expect(page.getByText("Death declaration")).toBeVisible();
      await expect(page.getByText(/Required/i)).toHaveCount(0);
    });
  });

  test.describe("1.2 Declaration Review - Deceased's details section", async () => {
    const deceasedDetails = {};
    test("1.2.1 Capture V1 Deceased's details", async () => {
      await page.goto(oldUrl);
      await expect(
        page.getByText("Death Declaration", { exact: true })
      ).toBeVisible();

      const ids = await page.evaluate(() => {
        const container = document.querySelector("#deceased-content");
        if (!container) return [];
        return Array.from(container.querySelectorAll("[id]")).map(
          (el) => el.id
        );
      });

      //console.log("IDs inside #deceased-content:", ids);

      const mappingsDeceasedDetails = {
        Full: "deceased.name",
        Sex: "deceased.gender",
        Date: "deceased.dob",
        Nationality: "deceased.nationality",
        Type: "deceased.idType",
        ID: "deceased.passport",
        Marital: "deceased.maritalStatus",
        "No.": "deceased.numberOfDependants",
        Usual: "deceased.address",
      };

      for (const id of ids) {
        // Escape special characters in id (like ".")
        const safeId = id.replace(/\./g, "\\.");
        const value = await page
          .locator(`#deceased-content #${safeId}`)
          .locator("td:nth-child(2)")
          .textContent();
        const v2Field = mappingsDeceasedDetails[id];
        if (v2Field) {
          deceasedDetails[v2Field] = value;
        }
      }
      //console.log("deceased V1 deceasedDetails", deceasedDetails);
    });
    test.skip("1.2.2 Compare V2 Deceased's details", async () => {
      const errors: string[] = [];
      await page.goto(newUrl);

      for (const [fieldName, v1FieldValue] of Object.entries(deceasedDetails)) {
        const v2FieldValue = await page
          .getByTestId(`row-value-${fieldName}`)
          .textContent();
        if (v2FieldValue !== v1FieldValue) {
          errors.push(`Mismatch in ${fieldName} field`);
        }
      }
      if (errors.length > 0) {
        throw new Error("Assertion failures:\n" + errors.join("\n"));
      }
    });
  });

  test.describe("1.3 Declaration Review - Event details section", async () => {
    const eventDetails = {};
    test("1.3.1 Capture V1 Event details", async () => {
      await page.goto(oldUrl);
      await expect(
        page.getByText("Death Declaration", { exact: true })
      ).toBeVisible();

      const ids = await page.evaluate(() => {
        const container = document.querySelector("#deathEvent-content");
        if (!container) return [];
        return Array.from(container.querySelectorAll("[id]")).map(
          (el) => el.id
        );
      });

      //console.log("IDs inside #deathEvent-content:", ids);

      const mappingsEventDetails = {
        Date: "eventDetails.date",
        Manner: "eventDetails.mannerOfDeath",
        Cause: "eventDetails.causeOfDeathEstablished",
        Place: "eventDetails.placeOfDeath",
      };

      for (const id of ids) {
        // Escape special characters in id (like ".")
        const safeId = id.replace(/\./g, "\\.");
        const value = await page
          .locator(`#deathEvent-content #${safeId}`)
          .locator("td:nth-child(2)")
          .textContent();
        const v2Field = mappingsEventDetails[id];
        if (v2Field) {
          eventDetails[v2Field] = value;
        }
      }
      //console.log("deceased V1 eventDetails", eventDetails);
    });
    test.skip("1.3.2 Compare V2 Event details", async () => {
      const errors: string[] = [];
      await page.goto(newUrl);

      for (const [fieldName, v1FieldValue] of Object.entries(eventDetails)) {
        const v2FieldValue = await page
          .getByTestId(`row-value-${fieldName}`)
          .textContent();
        if (v2FieldValue !== v1FieldValue) {
          errors.push(`Mismatch in ${fieldName} field`);
        }
      }
      if (errors.length > 0) {
        throw new Error("Assertion failures:\n" + errors.join("\n"));
      }
    });
  });

   test.describe("1.4 Declaration Review - Informant's details section", async () => {
    const informantDetails = {};
    test("1.4.1 Capture V1 Informant details", async () => {
      await page.goto(oldUrl);
      await expect(
        page.getByText("Death Declaration", { exact: true })
      ).toBeVisible();

      const ids = await page.evaluate(() => {
        const container = document.querySelector("#informant-content");
        if (!container) return [];
        return Array.from(container.querySelectorAll("[id]")).map(
          (el) => el.id
        );
      });

      //console.log("IDs inside #informant-content:", ids);

      const mappingsInformantDetails = {
        Informant: "informant.relation",
        Phone: "informant.phoneNo",
        Email: "informant.email",
        Full: "informant.name",
        Date: "informant.dob",
        Nationality: "informant.nationality",
        Type: "informant.idType",
        ID: "informant.passport",
        Same: "informant.addressSameAs",
      };

      for (const id of ids) {
        // Escape special characters in id (like ".")
        const safeId = id.replace(/\./g, "\\.");
        const value = await page
          .locator(`#informant-content #${safeId}`)
          .locator("td:nth-child(2)")
          .textContent();
        const v2Field = mappingsInformantDetails[id];
        if (v2Field) {
          informantDetails[v2Field] = value;
        }
      }
      //console.log("deceased V1 informantDetails", informantDetails);
    });
    test.skip("1.4.2 Compare V2 Informant details", async () => {
      const errors: string[] = [];
      await page.goto(newUrl);

      for (const [fieldName, v1FieldValue] of Object.entries(informantDetails)) {
        const v2FieldValue = await page
          .getByTestId(`row-value-${fieldName}`)
          .textContent();
        if (v2FieldValue !== v1FieldValue) {
          errors.push(`Mismatch in ${fieldName} field`);
        }
      }
      if (errors.length > 0) {
        throw new Error("Assertion failures:\n" + errors.join("\n"));
      }
    });
   });

   test.describe("1.5 Declaration Review - Spouse details section", async () => {
    const spouseDetails = {};
    test("1.5.1 Capture V1 Spouse details", async () => {
      await page.goto(oldUrl);
      await expect(
        page.getByText("Death Declaration", { exact: true })
      ).toBeVisible();

      const ids = await page.evaluate(() => {
        const container = document.querySelector("#spouse-content");
        if (!container) return [];
        return Array.from(container.querySelectorAll("[id]")).map(
          (el) => el.id
        );
      });

      //console.log("IDs inside #spouse-content:", ids);

      const mappingsSpouseDetails = {
        Full: "spouse.name",
        Date: "spouse.dob",
        Nationality: "spouse.nationality",
        Type: "spouse.idType",
        /* ID: "spouse.passport", */
        Same: "spouse.addressSameAs",
      };

      for (const id of ids) {
        // Escape special characters in id (like ".")
        const safeId = id.replace(/\./g, "\\.");
        const value = await page
          .locator(`#spouse-content #${safeId}`)
          .locator("td:nth-child(2)")
          .textContent();
        const v2Field = mappingsSpouseDetails[id];
        if (v2Field) {
          spouseDetails[v2Field] = value;
        }
      }
      //console.log("deceased V1 spouseDetails", spouseDetails);
    });
    test.skip("1.5.2 Compare V2 Spouse details", async () => {
      const errors: string[] = [];
      await page.goto(newUrl);

      for (const [fieldName, v1FieldValue] of Object.entries(spouseDetails)) {
        const v2FieldValue = await page
          .getByTestId(`row-value-${fieldName}`)
          .textContent();
        if (v2FieldValue !== v1FieldValue) {
          errors.push(`Mismatch in ${fieldName} field`);
        }
      }
      if (errors.length > 0) {
        throw new Error("Assertion failures:\n" + errors.join("\n"));
      }
    });
   });
});
