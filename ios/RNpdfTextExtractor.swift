//
//  RNpdfTextExtractor.swift
//  weightress
//
//  Created by Alex on 24.08.2021.
//

import Foundation
import PDFKit
import RCTText

@objc(PDFExtractor)
class PDFExtractor : NSObject {
  
  @objc static func requiresMainQueueSetup() -> Bool {
    return false
  }
  
  // Reference to use main thread
  @objc func extractTextFrom(_ options: NSString, myCallback: @escaping RCTResponseSenderBlock) -> Void {
    DispatchQueue.main.async {
      self._extractTextFrom(options: options, myCallback)
    }
  }
  
  func _extractTextFrom(options: NSString, _ myCallback: @escaping RCTResponseSenderBlock) -> Void {
    
//    var items = [String]()
//    let message = RCTConvert.nsString(options["message"])
//
//    if message != "" {
//      items.append(message!)
//    }
    
    if options.length == 0 {
      print("No `message` to share!")
      return
    }
    let documentContent = NSMutableAttributedString()
    var pages: [String] = []
    
    if #available(iOS 11.0, *) {
      let url = URL(string: String(options))!
      if let pdf = PDFDocument(url: url) {
        let pageCount = pdf.pageCount
        for i in 0 ..< pageCount {
          guard let page = pdf.page(at: i),
                let pageContent = page.attributedString else { continue }
          documentContent.append(pageContent)
          pages.append(pageContent.string)
        }
      }
    } else {
      // Fallback on earlier versions
    }
//    myCallback([String(documentContent.mutableString)])
    myCallback([pages.joined(separator: "\t\n\t")])
  }
  
}
