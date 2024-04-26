//
//  RNpdfTextExtractor.m
//  weightress
//
//  Created by Alex on 24.08.2021.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTViewManager.h>
#import <React/RCTLog.h>
#import "PDFExtractModule.h"

@interface RCT_EXTERN_MODULE(PDFExtractor, NSObject)

RCT_EXTERN_METHOD(extractTextFrom:(NSString *)options
                  myCallback:(RCTResponseSenderBlock)myCallback)

@end

@implementation RCTPDFExtractorModule

// To export a module named RCTCalendarModule
RCT_EXPORT_MODULE(PDFExtractor);

RCT_EXPORT_METHOD(extractTextFrom:(NSString *)options
                  myCallback:(RCTResponseSenderBlock)myCallback)
{
 RCTLogInfo(@"Pretending to create an native method");
}

@end
