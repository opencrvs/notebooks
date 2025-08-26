import { getCustomField, getIdentifier } from "./resolverUtils.ts";

function convertChildAddress(data, address) {
  if (!address) {
    return null;
  }

  const country = getCustomField(
    data,
    "birth.child.child-view-group.countryPrimaryChild"
  );
  const international = country !== "FAR"; //This doesn't work for other countries
  if (international) {
    return {
      addressType: "INTERNATIONAL",
      country,
      cityOrTown: getCustomField(
        data,
        "birth.child-view-group.internationalCityPrimaryChild"
      ),
    };
  }
  return {
    addressType: "DOMESTIC",
    country,
    state: getCustomField(data, "birth.child-view-group.statePrimaryChild"),
    district: getCustomField(
      data,
      "birth.child-view-group.districtPrimaryChild"
    ),
    cityOrTown: getCustomField(data, "birth.child-view-group.cityPrimaryChild"),
    addressLine1: getCustomField(
      data,
      "birth.child-view-group.addressLine1PrimaryChild"
    ),
    addressLine2: getCustomField(
      data,
      "birth.child-view-group.addressLine2PrimaryChild"
    ),
    addressLine3: getCustomField(
      data,
      "birth.child-view-group.addressLine3PrimaryChild"
    ),
    postcodeOrZip: getCustomField(
      data,
      "birth.child-view-group.postalCodePrimaryChild"
    ),
  };
}

export const countryResolver = {
  "child.nid": (data) => getIdentifier(data.child, "NATIONAL_ID"),
  "child.address": (data) =>
    convertChildAddress(data, data.eventLocation.address),
  "child.attendantName": (data) =>
    getCustomField(data, "birth.child.child-view-group.birthAttendantName"),
  "child.attedantAtBirthId": (data) =>
    getCustomField(data, "birth.child.child-view-group.birthAttendantId"),
};
