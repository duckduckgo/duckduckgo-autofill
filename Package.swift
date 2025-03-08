// swift-tools-version:5.7
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "Autofill",
    products: [
        .library(
            name: "Autofill",
            targets: ["Autofill"]),
    ],
    dependencies: [
    ],
    targets: [
        .target(
            name: "Autofill",
            dependencies: [.target(name: "AutofillResources")],
            path: "swift-package/Resources"
        ),
        .target(
            name: "AutofillResources",
            path: "dist",
            exclude: ["autofill-host-styles_chrome.css", "autofill-host-styles_firefox.css"],
            resources: [
                .copy("autofill.js"),
                .copy("autofill-debug.js"),
                .copy("autofill.css"),
                .copy("shared-credentials.json"),
                .copy("TopAutofill.html"),
            ]
        )
    ]
)
